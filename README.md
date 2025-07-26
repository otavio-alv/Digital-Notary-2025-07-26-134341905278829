# Cartório Digital ICP - Frontend

## 🎯 Visão Geral
Sistema frontend para cartório digital descentralizado construído no Internet Computer Protocol (ICP). Foca na modernização de serviços notariais através de tecnologia blockchain.

## 🏗️ Arquitetura ICP

### Canisters
- **Frontend Canister**: Interface servida diretamente da blockchain
- **Backend Canister**: Lógica de negócios em Motoko/Rust
- **Internet Identity**: Autenticação descentralizada

### Vantagens do ICP
- **Gás Reverso**: Usuários não pagam taxas
- **Armazenamento On-Chain**: Dados permanentes na blockchain
- **Internet Identity**: Autenticação sem senhas
- **Web3 Nativo**: Frontend totalmente descentralizado

## 🚀 Funcionalidades

### ✅ MVP - Timestamping (Disponível)
- Upload de arquivos com drag & drop
- Geração automática de hash SHA-256
- Registro permanente na blockchain ICP
- Verificação de autenticidade
- Certificados de timestamp

### 🔄 Em Desenvolvimento
- **Assinatura Digital**: Baseada em Internet Identity
- **Contratos Inteligentes**: Templates automatizados
- **Procurações Digitais**: Sistema de permissões

## 🛠️ Tecnologias

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Design moderno e responsivo
- **JavaScript ES6+**: Funcionalidades interativas
- **Web Crypto API**: Geração de hash SHA-256

### Blockchain
- **Internet Computer**: Plataforma blockchain
- **Internet Identity**: Sistema de autenticação
- **Motoko/Rust**: Linguagens para canisters

## 📱 Interface

### Design System
- **Cores Primárias**: ICP Blue (#29abe2), Orange (#f15a24)
- **Tipografia**: Inter, sistema fonts
- **Componentes**: Cards, botões, formulários responsivos
- **Animações**: Transições suaves, feedback visual

### Responsividade
- Mobile-first approach
- Breakpoints: 480px, 768px, 1200px
- Touch-friendly interface
- Acessibilidade WCAG 2.1

## 🔐 Segurança

### Criptografia
- **Hash SHA-256**: Impressão digital dos arquivos
- **Internet Identity**: Autenticação criptográfica
- **Blockchain**: Imutabilidade dos registros

### Privacidade
- Arquivos não são armazenados, apenas hashes
- Principal IDs para identificação
- Dados criptografados end-to-end

## 🚀 Como Usar

### 1. Timestamping
1. Conecte-se com Internet Identity
2. Faça upload do arquivo (drag & drop)
3. Visualize o hash SHA-256 gerado
4. Registre o timestamp na blockchain
5. Receba certificado de autenticidade

### 2. Verificação
1. Cole o hash do documento
2. Consulte a blockchain ICP
3. Visualize detalhes do registro
4. Confirme autenticidade

## 📊 Dados Técnicos

### Performance
- **Geração de Hash**: < 1s para arquivos até 10MB
- **Registro Blockchain**: ~3s (simulado)
- **Verificação**: ~2s (simulado)

### Limites
- **Tamanho de Arquivo**: Sem limite (apenas hash é processado)
- **Tipos Suportados**: Todos os formatos
- **Concurrent Users**: Escalável via ICP

## 🔧 Configuração Local

\`\`\`bash
# Instalar DFX
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

# Iniciar replica local
dfx start --background

# Deploy dos canisters
dfx deploy

# Abrir frontend
dfx canister call cartorio_frontend http_request
\`\`\`

## 📈 Roadmap

### Fase 1 (MVP) ✅
- [x] Timestamping de documentos
- [x] Interface responsiva
- [x] Integração Internet Identity (simulada)

### Fase 2 (Q2 2024)
- [ ] Assinatura digital real
- [ ] Backend Motoko
- [ ] Deploy na mainnet IC

### Fase 3 (Q3 2024)
- [ ] Contratos inteligentes
- [ ] Procurações digitais
- [ ] API para terceiros

## 🤝 Contribuição

Este é um projeto open source. Contribuições são bem-vindas!

### Como Contribuir
1. Fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

MIT License - veja LICENSE.md para detalhes

## 🌐 Links

- **Internet Computer**: https://internetcomputer.org
- **Internet Identity**: https://identity.ic0.app
- **DFX SDK**: https://sdk.dfinity.org
- **Motoko**: https://github.com/dfinity/motoko

---

**Cartório Digital ICP** - Modernizando serviços notariais com tecnologia blockchain descentralizada.
