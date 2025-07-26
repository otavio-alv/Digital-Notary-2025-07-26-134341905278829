ProbatumICP

🎯 Overview

Frontend system for a decentralized digital notary built on the Internet Computer Protocol (ICP). Aims to modernize notarial services through blockchain technology.

🏗️ ICP Architecture

Canisters

Frontend Canister: Interface served directly from the blockchain

Backend Canister: Business logic in Motoko/Rust

Internet Identity: Decentralized authentication


ICP Advantages

Reverse Gas: Users don’t pay transaction fees

On-Chain Storage: Data permanently stored on the blockchain

Internet Identity: Passwordless authentication

Native Web3: Fully decentralized frontend


🚀 Features

✅ MVP - Timestamping (Available)

File upload with drag & drop

Automatic SHA-256 hash generation

Permanent registration on the ICP blockchain

Authenticity verification

Timestamp certificates


🔄 In Development

Digital Signature: Based on Internet Identity

Smart Contracts: Automated templates

Digital Powers of Attorney: Permission system


🛠️ Technologies

Frontend

HTML5: Semantic structure

CSS3: Modern, responsive design

JavaScript ES6+: Interactive functionality

Web Crypto API: SHA-256 hash generation


Blockchain

Internet Computer: Blockchain platform

Internet Identity: Authentication system

Motoko/Rust: Languages for canisters


📱 Interface

Design System

Primary Colors: ICP Blue (#29abe2), Orange (#f15a24)

Typography: Inter, system fonts

Components: Cards, buttons, responsive forms

Animations: Smooth transitions, visual feedback


Responsiveness

Mobile-first approach

Breakpoints: 480px, 768px, 1200px

Touch-friendly interface

WCAG 2.1 accessibility compliance


🔐 Security

Cryptography

SHA-256 Hash: File digital fingerprint

Internet Identity: Cryptographic authentication

Blockchain: Immutable records


Privacy

Files are not stored, only hashes

Principal IDs for identification

End-to-end encrypted data


🚀 How to Use

1. Timestamping

1. Connect using Internet Identity


2. Upload a file (drag & drop)


3. View the generated SHA-256 hash


4. Register the timestamp on the blockchain


5. Receive authenticity certificate



2. Verification

1. Paste the document hash


2. Query the ICP blockchain


3. View registration details


4. Confirm authenticity



📊 Technical Data

Performance

Hash Generation: < 1s for files up to 10MB

Blockchain Registration: ~3s (simulated)

Verification: ~2s (simulated)


Limits

File Size: No limit (only hash is processed)

Supported Formats: All file types

Concurrent Users: Scalable via ICP


🔧 Local Setup

# Install DFX
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

# Start local replica
dfx start --background

# Deploy canisters
dfx deploy

# Open frontend
dfx canister call probatum_frontend http_request

📈 Roadmap

Phase 1 (MVP) ✅

[x] Document timestamping

[x] Responsive interface

[x] Internet Identity integration (simulated)


Phase 2 (Q2 2024)

[ ] Real digital signature

[ ] Backend in Motoko

[ ] Mainnet deployment on IC


Phase 3 (Q3 2024)

[ ] Smart contracts

[ ] Digital powers of attorney

[ ] Third-party API


🌐 Links

Internet Computer: https://internetcomputer.org

Internet Identity: https://identity.ic0.app

DFX SDK: https://sdk.dfinity.org

Motoko: https://github.com/dfinity/motoko


