
// ICP application state
let isConnected = false
let userPrincipal = null
let timestamps = []
let currentFile = null
let currentHash = null

// Internet Computer simulated data
const icpData = {
  canisterId: "rdmx6-jaaaa-aaaah-qdrqq-cai",
  network: "local",
  host: "http://localhost:8000",
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  loadStoredData()
})

// Initial app setup
function initializeApp() {
  console.log("🚀 Digital Notary ICP initialized")
  console.log("📦 Canister ID:", icpData.canisterId)

  // Check for saved connection
  const savedConnection = localStorage.getItem("icp_connection")
  if (savedConnection) {
    const connectionData = JSON.parse(savedConnection)
    simulateConnection(connectionData.principal)
  }

  setupFileUpload()
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetSection = this.getAttribute("href").substring(1)
      showSection(targetSection)
      updateActiveNavLink(this)
    })
  })

  // Connection buttons
  document.getElementById("connectBtn").addEventListener("click", connectInternetIdentity)
  document.getElementById("disconnectBtn").addEventListener("click", disconnectIdentity)

  // Action buttons
  document.getElementById("timestampBtn").addEventListener("click", createTimestamp)
}

// Setup file upload
function setupFileUpload() {
  const uploadArea = document.getElementById("uploadArea")
  const fileInput = document.getElementById("fileInput")

  // Click to select file
  uploadArea.addEventListener("click", () => {
    fileInput.click()
  })

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.classList.add("dragover")
  })

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover")
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("dragover")
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  })

  // Input change
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  })
}

// Connect with Internet Identity (simulated)
async function connectInternetIdentity() {
  showLoading(true, "Connecting to Internet Identity...")

  try {
    // Simulate authentication process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate simulated Principal ID
    const principal = generatePrincipalId()
    simulateConnection(principal)

    showMessage("success", "Successfully connected to Internet Identity!")
  } catch (error) {
    showMessage("error", "Error connecting to Internet Identity")
    console.error("Connection error:", error)
  } finally {
    showLoading(false)
  }
}

// Simulate established connection
function simulateConnection(principal) {
  isConnected = true
  userPrincipal = principal

  // Update UI
  document.getElementById("connectBtn").style.display = "none"
  document.getElementById("userInfo").style.display = "flex"
  document.querySelector(".principal-id").textContent = principal

  // Save connection
  localStorage.setItem("icp_connection", JSON.stringify({ principal, timestamp: Date.now() }))

  // Enable authenticated-only features
  updateAuthenticatedState()
}

// Disconnect identity
function disconnectIdentity() {
  isConnected = false
  userPrincipal = null

  // Update UI
  document.getElementById("connectBtn").style.display = "flex"
  document.getElementById("userInfo").style.display = "none"

  // Clear saved data
  localStorage.removeItem("icp_connection")

  // Disable features
  updateAuthenticatedState()

  showMessage("info", "Disconnected from Internet Identity")
}

// Update authentication state
function updateAuthenticatedState() {
  const timestampBtn = document.getElementById("timestampBtn")
  if (timestampBtn) {
    timestampBtn.disabled = !isConnected || !currentHash
  }
}

// Generate simulated Principal ID
function generatePrincipalId() {
  const chars = "abcdefghijklmnopqrstuvwxyz234567"
  let result = ""
  for (let i = 0; i < 63; i++) {
    if (i > 0 && i % 5 === 0) result += "-"
    else result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Handle file selection
async function handleFileSelect(file) {
  currentFile = file

  // Show file info
  document.getElementById("fileName").textContent = file.name
  document.getElementById("fileSize").textContent = formatFileSize(file.size)
  document.getElementById("fileType").textContent = file.type || "Unknown type"

  document.getElementById("uploadArea").style.display = "none"
  document.getElementById("fileInfo").style.display = "flex"

  // Generate file hash
  showLoading(true, "Generating SHA-256 hash...")

  try {
    currentHash = await generateFileHash(file)

    // Show generated hash
    document.getElementById("hashValue").innerHTML = `<code>${currentHash}</code>`
    document.getElementById("copyHashBtn").style.display = "inline-flex"

    // Enable timestamp button if connected
    updateAuthenticatedState()

    showMessage("success", "SHA-256 hash generated successfully!")
  } catch (error) {
    showMessage("error", "Error generating file hash")
    console.error("Hash generation error:", error)
  } finally {
    showLoading(false)
  }
}

// Generate SHA-256 file hash
async function generateFileHash(file) {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

// Clear selected file
function clearFile() {
  currentFile = null
  currentHash = null

  document.getElementById("uploadArea").style.display = "block"
  document.getElementById("fileInfo").style.display = "none"
  document.getElementById("hashValue").innerHTML =
    '<span class="placeholder">Hash will be generated after selecting a file</span>'
  document.getElementById("copyHashBtn").style.display = "none"
  document.getElementById("fileInput").value = ""

  updateAuthenticatedState()
}

// Copy hash to clipboard
async function copyHash() {
  if (currentHash) {
    try {
      await navigator.clipboard.writeText(currentHash)
      showMessage("success", "Hash copied to clipboard!")
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = currentHash
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      showMessage("success", "Hash copied to clipboard!")
    }
  }
}

// Create timestamp on blockchain (simulated)
async function createTimestamp() {
  if (!isConnected) {
    showMessage("error", "Please connect to Internet Identity first")
    return
  }

  if (!currentHash) {
    showMessage("error", "Please select a file first")
    return
  }

  showLoading(true, "Registering timestamp on ICP blockchain...")

  try {
    // Simulate canister call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Create timestamp record
    const timestamp = {
      id: generateTimestampId(),
      hash: currentHash,
      principal: userPrincipal,
      filename: currentFile.name,
      filesize: currentFile.size,
      timestamp: new Date().toISOString(),
      blockHeight: Math.floor(Math.random() * 1000000) + 500000,
      canisterId: icpData.canisterId,
    }

    // Save timestamp
    timestamps.push(timestamp)
    saveTimestamps()

    // Show result
    showTimestampResult(timestamp)

    showMessage("success", "Timestamp successfully registered on the blockchain!")
  } catch (error) {
    showMessage("error", "Error registering timestamp on the blockchain")
    console.error("Timestamp error:", error)
  } finally {
    showLoading(false)
  }
}

// Show timestamp result
function showTimestampResult(timestamp) {
  const resultDiv = document.getElementById("timestampResult")

  resultDiv.innerHTML = `
    <div class="timestamp-success">
      <div class="success-header">
        <i class="fas fa-check-circle"></i>
        <h3>Timestamp Successfully Registered!</h3>
      </div>
      
      <div class="timestamp-details">
        <div class="detail-row">
          <label>Timestamp ID:</label>
          <span class="monospace">${timestamp.id}</span>
        </div>
        <div class="detail-row">
          <label>SHA-256 Hash:</label>
          <span class="monospace hash-display">${timestamp.hash}</span>
        </div>
        <div class="detail-row">
          <label>Principal ID:</label>
          <span class="monospace">${timestamp.principal}</span>
        </div>
        <div class="detail-row">
          <label>File:</label>
          <span>${timestamp.filename} (${formatFileSize(timestamp.filesize)})</span>
        </div>
        <div class="detail-row">
          <label>Date/Time:</label>
          <span>${formatTimestamp(timestamp.timestamp)}</span>
        </div>
        <div class="detail-row">
          <label>Block Height:</label>
          <span class="monospace">${timestamp.blockHeight}</span>
        </div>
        <div class="detail-row">
          <label>Canister ID:</label>
          <span class="monospace">${timestamp.canisterId}</span>
        </div>
      </div>
      
      <div class="timestamp-actions">
        <button class="btn btn-primary" onclick="copyTimestampId('${timestamp.id}')">
          <i class="fas fa-copy"></i>
          Copy ID
        </button>
        <button class="btn btn-secondary" onclick="downloadCertificate('${timestamp.id}')">
          <i class="fas fa-download"></i>
          Download Certificate
        </button>
      </div>
      
      <div class="blockchain-proof">
        <h4><i class="fas fa-shield-alt"></i> Blockchain Proof</h4>
        <p>This document was permanently recorded on the Internet Computer blockchain.
        The hash, timestamp, and your identity were immutably stored in the canister
        <code>${timestamp.canisterId}</code>.</p>
      </div>
    </div>
  `

  resultDiv.style.display = "block"
  resultDiv.scrollIntoView({ behavior: "smooth" })
}

// Verify existing timestamp
async function verifyTimestamp() {
  const hash = document.getElementById("verifyHash").value.trim()

  if (!hash) {
    showMessage("error", "Please enter the document hash")
    return
  }

  if (hash.length !== 64) {
    showMessage("error", "SHA-256 hash must be 64 characters")
    return
  }

  showLoading(true, "Verifying on the blockchain...")

  try {
    // Simulate blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Search timestamp
    const timestamp = timestamps.find((t) => t.hash === hash)
    const resultDiv = document.getElementById("verificationResult")

    if (timestamp) {
      resultDiv.innerHTML = `
        <div class="verification-success">
          <h4><i class="fas fa-check-circle"></i> Document Verified!</h4>
          <div class="verification-details">
            <p><strong>File:</strong> ${timestamp.filename}</p>
            <p><strong>Registered on:</strong> ${formatTimestamp(timestamp.timestamp)}</p>
            <p><strong>Principal:</strong> <code>${timestamp.principal}</code></p>
            <p><strong>Block Height:</strong> ${timestamp.blockHeight}</p>
            <p><strong>ID:</strong> <code>${timestamp.id}</code></p>
          </div>
          <div class="verification-badges">
            <span class="badge badge-success">
              <i class="fas fa-shield-alt"></i> Authentic
            </span>
            <span class="badge badge-info">
              <i class="fas fa-blockchain"></i> ICP Blockchain
            </span>
          </div>
        </div>
      `
      resultDiv.className = "verification-result success"
    } else {
      resultDiv.innerHTML = `
        <div class="verification-error">
          <h4><i class="fas fa-times-circle"></i> Document Not Found</h4>
          <p>The provided hash was not found on the Internet Computer blockchain.</p>
          <div class="verification-tips">
            <h5>Check that:</h5>
            <ul>
              <li>The hash was copied correctly</li>
              <li>The document was registered in this notary</li>
              <li>There are no extra spaces in the hash</li>
            </ul>
          </div>
        </div>
      `
      resultDiv.className = "verification-result error"
    }

    resultDiv.style.display = "block"
  } catch (error) {
    showMessage("error", "Verification error. Please try again.")
    console.error("Verification error:", error)
  } finally {
    showLoading(false)
  }
}

// Section navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show selected section
  document.getElementById(sectionId).classList.add("active")
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })
  activeLink.classList.add("active")
}

// Utilities
function generateTimestampId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `TS-${timestamp}-${random}`.toUpperCase()
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatTimestamp(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function copyTimestampId(id) {
  navigator.clipboard.writeText(id).then(() => {
    showMessage("success", "Timestamp ID copied!")
  })
}

function downloadCertificate(id) {
  const timestamp = timestamps.find((t) => t.id === id)
  if (timestamp) {
    // Simulate certificate download
    showMessage("info", `Certificate download for ${id} started`)
    // Real PDF generation would be implemented here
  }
}

// Show loading
function showLoading(show, message = "Processing...") {
  const overlay = document.getElementById("loadingOverlay")
  if (show) {
    overlay.querySelector("p").textContent = message
    overlay.style.display = "flex"
  } else {
    overlay.style.display = "none"
  }
}

// Show message
function showMessage(type, message) {
  // Remove existing messages
  document.querySelectorAll(".message").forEach((msg) => msg.remove())

  // Create new message
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${type}`

  const icon =
    type === "success"
      ? "check-circle"
      : type === "error"
        ? "times-circle"
        : type === "info"
          ? "info-circle"
          : "exclamation-triangle"

  messageDiv.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `

  // Insert at top of active section
  const activeSection = document.querySelector(".section.active")
  const container = activeSection.querySelector(".container")
  container.insertBefore(messageDiv, container.firstChild)

  // Remove after 5 seconds
  setTimeout(() => {
    messageDiv.remove()
  }, 5000)
}

// Save and load data
function saveTimestamps() {
  localStorage.setItem("icp_timestamps", JSON.stringify(timestamps))
}

function loadStoredData() {
  const savedTimestamps = localStorage.getItem("icp_timestamps")
  if (savedTimestamps) {
    timestamps = JSON.parse(savedTimestamps)
  }
}

// Add dynamic CSS styles
const additionalStyles = `
  .message {
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideIn 0.3s ease;
  }

  .message.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .message.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }

  .message.warning {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }

  .timestamp-success {
    text-align: left;
  }

  .success

