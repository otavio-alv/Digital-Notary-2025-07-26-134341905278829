import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";


actor DigitalNotaryBackend {

  // =================================================================================
  // DATA MODELS
  // =================================================================================

  // Defines the structure for each timestamp record.
  public type TimestampRecord = {
    id : Nat;
    owner : Principal;
    filename : Text;
    file_hash : Text;
    created_at : Time.Time
  };

  // Defines types to store stable data.
  type StableUserTimestamps = [(Principal, [TimestampRecord])];
  type StableHashToIdMap = [(Text, Nat)];

  // Canister state during execution. Contains HashMaps for efficient access.
  var user_timestamps : HashMap.HashMap<Principal, [TimestampRecord]> = HashMap.HashMap<Principal, [TimestampRecord]>(0, Principal.equal, Principal.hash);
  var hash_to_record_id : HashMap.HashMap<Text, Nat> = HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);
  var next_record_id : Nat = 0;

  // =================================================================================
  // DATA PERSISTENCE (UPGRADE HOOKS)
  // =================================================================================

  // Stable variables to store data during canister upgrade.
  stable var stable_user_timestamps : StableUserTimestamps = [];
  stable var stable_hash_to_id_map : StableHashToIdMap = [];
  stable var stable_next_record_id : Nat = 0;

  // System function 'preupgrade': automatically executed BEFORE an upgrade.
  system func preupgrade() {
    stable_user_timestamps := Iter.toArray(user_timestamps.entries());
    stable_hash_to_id_map := Iter.toArray(hash_to_record_id.entries());
    stable_next_record_id := next_record_id
  };

  // System function 'postupgrade': automatically executed AFTER an upgrade.
  // FIX: Iterates directly over the array, without calling `.iter()`.
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
  // UPDATE FUNCTIONS (UPDATE CALLS)
  // =================================================================================

  public shared (msg) func createTimestamp(filename : Text, file_hash : Text) : async Result.Result<Nat, Text> {
    if (file_hash.size() != 64) {
      return #err("SHA-256 hash must be 64 characters long.")
    };

    if (hash_to_record_id.get(file_hash) != null) {
      return #err("This file already has a registered timestamp.")
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
  // QUERY FUNCTIONS (QUERY CALLS)
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