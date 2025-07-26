import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";


actor CartorioBackend {

  // =================================================================================
  // TIPOS DE DADOS (DATA MODELS)
  // =================================================================================

  // Define a estrutura para cada registro de timestamp.
  public type TimestampRecord = {
    id : Nat;
    owner : Principal;
    filename : Text;
    file_hash : Text;
    created_at : Time.Time
  };

  // Define os tipos que serão usados para armazenar os dados de forma estável.
  type StableUserTimestamps = [(Principal, [TimestampRecord])];
  type StableHashToIdMap = [(Text, Nat)];

  // Estado do canister durante a execução. Contém HashMaps para acesso eficiente.
  var user_timestamps : HashMap.HashMap<Principal, [TimestampRecord]> = HashMap.HashMap<Principal, [TimestampRecord]>(0, Principal.equal, Principal.hash);
  var hash_to_record_id : HashMap.HashMap<Text, Nat> = HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);
  var next_record_id : Nat = 0;

  // =================================================================================
  // PERSISTÊNCIA DE DADOS (UPGRADE HOOKS)
  // =================================================================================

  // Variáveis estáveis para armazenar os dados durante o upgrade do canister.
  stable var stable_user_timestamps : StableUserTimestamps = [];
  stable var stable_hash_to_id_map : StableHashToIdMap = [];
  stable var stable_next_record_id : Nat = 0;

  // Função de sistema 'preupgrade': executada automaticamente ANTES de um upgrade.
  system func preupgrade() {
    stable_user_timestamps := Iter.toArray(user_timestamps.entries());
    stable_hash_to_id_map := Iter.toArray(hash_to_record_id.entries());
    stable_next_record_id := next_record_id
  };

  // Função de sistema 'postupgrade': executada automaticamente DEPOIS de um upgrade.
  // CORREÇÃO: Itera diretamente sobre o array, sem chamar `.iter()`.
  system func postupgrade() {
    user_timestamps := HashMap.HashMap<Principal, [TimestampRecord]>(0, Principal.equal, Principal.hash);
    hash_to_record_id := HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);

    for ((key, value) in stable_user_timestamps.vals()) {
      user_timestamps.put(key, value)
    };
    for ((key, value) in stable_hash_to_id_map.vals()) {
      hash_to_record_id.put(key, value)
    };

    next_record_id := stable_next_record_id
  };

  // =================================================================================
  // FUNÇÕES DE ATUALIZAÇÃO (UPDATE CALLS)
  // =================================================================================

  public shared (msg) func createTimestamp(filename : Text, file_hash : Text) : async Result.Result<Nat, Text> {
    if (file_hash.size() != 64) {
      return #err("O hash SHA-256 deve ter 64 caracteres.")
    };

    if (hash_to_record_id.get(file_hash) != null) {
      return #err("Este arquivo já possui um timestamp registrado.")
    };

    let caller = msg.caller;
    let timestamp = Time.now();
    let record_id = next_record_id;

    let newRecord : TimestampRecord = {
      id = record_id;
      owner = caller;
      filename = filename;
      file_hash = file_hash;
      created_at = timestamp
    };

    switch (user_timestamps.get(caller)) {
      case (null) {
        user_timestamps.put(caller, [newRecord])
      };
      case (?userRecords) {
        let updatedRecords = Array.append(userRecords, [newRecord]);
        user_timestamps.put(caller, updatedRecords)
      }
    };

    hash_to_record_id.put(file_hash, record_id);
    next_record_id += 1;

    return #ok(record_id)
  };

  // =================================================================================
  // FUNÇÕES DE CONSULTA (QUERY CALLS)
  // =================================================================================

  public query func getUserTimestamps(user : Principal) : async [TimestampRecord] {
    switch (user_timestamps.get(user)) {
      case (null) {return []};
      case (?records) {return records}
    }
  };

  public query func verifyTimestamp(file_hash : Text) : async ?TimestampRecord {
    let recordIdOpt = hash_to_record_id.get(file_hash);

    switch (recordIdOpt) {
      case (null) {return null};
      case (?recordId) {
        for (userRecords in user_timestamps.vals()) {
          for (record in userRecords.vals()) {
            if (record.id == recordId) {
              return ?record
            }
          }
        };
        return null
      }
    }
  }
}
