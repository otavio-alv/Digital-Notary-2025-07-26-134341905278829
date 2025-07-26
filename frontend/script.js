// Estado da aplicação ICP
let isConnected = false
let userPrincipal = null
let timestamps = []
let currentFile = null
let currentHash = null

// Simulação de dados do Internet Computer
const icpData = {
  canisterId: "rdmx6-jaaaa-aaaah-qdrqq-cai",
  network: "local",
  host: "http://localhost:8000",
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  loadStoredData()
})

// Configuração inicial da aplicação
function initializeApp() {
  console.log("🚀 Cartório Digital ICP inicializado")
  console.log("📦 Canister ID:", icpData.canisterId)

  // Verificar se há conexão salva
  const savedConnection = localStorage.getItem("icp_connection")
  if (savedConnection) {
    const connectionData = JSON.parse(savedConnection)
    simulateConnection(connectionData.principal)
  }

  setupFileUpload()
}

// Configurar event listeners
function setupEventListeners() {
  // Navegação
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetSection = this.getAttribute("href").substring(1)
      showSection(targetSection)
      updateActiveNavLink(this)
    })
  })

  // Botões de conexão
  document.getElementById("connectBtn").addEventListener("click", connectInternetIdentity)
  document.getElementById("disconnectBtn").addEventListener("click", disconnectIdentity)

  // Botões de ação
  document.getElementById("timestampBtn").addEventListener("click", createTimestamp)
}

// Configurar upload de arquivo
function setupFileUpload() {
  const uploadArea = document.getElementById("uploadArea")
  const fileInput = document.getElementById("fileInput")

  // Click para selecionar arquivo
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

// Conectar com Internet Identity (simulado)
async function connectInternetIdentity() {
  showLoading(true, "Conectando com Internet Identity...")

  try {
    // Simular processo de autenticação
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Gerar Principal ID simulado
    const principal = generatePrincipalId()
    simulateConnection(principal)

    showMessage("success", "Conectado com sucesso ao Internet Identity!")
  } catch (error) {
    showMessage("error", "Erro ao conectar com Internet Identity")
    console.error("Erro na conexão:", error)
  } finally {
    showLoading(false)
  }
}

// Simular conexão estabelecida
function simulateConnection(principal) {
  isConnected = true
  userPrincipal = principal

  // Atualizar UI
  document.getElementById("connectBtn").style.display = "none"
  document.getElementById("userInfo").style.display = "flex"
  document.querySelector(".principal-id").textContent = principal

  // Salvar conexão
  localStorage.setItem("icp_connection", JSON.stringify({ principal, timestamp: Date.now() }))

  // Habilitar funcionalidades que requerem autenticação
  updateAuthenticatedState()
}

// Desconectar identidade
function disconnectIdentity() {
  isConnected = false
  userPrincipal = null

  // Atualizar UI
  document.getElementById("connectBtn").style.display = "flex"
  document.getElementById("userInfo").style.display = "none"

  // Limpar dados salvos
  localStorage.removeItem("icp_connection")

  // Desabilitar funcionalidades
  updateAuthenticatedState()

  showMessage("info", "Desconectado do Internet Identity")
}

// Atualizar estado de autenticação
function updateAuthenticatedState() {
  const timestampBtn = document.getElementById("timestampBtn")
  if (timestampBtn) {
    timestampBtn.disabled = !isConnected || !currentHash
  }
}

// Gerar Principal ID simulado
function generatePrincipalId() {
  const chars = "abcdefghijklmnopqrstuvwxyz234567"
  let result = ""
  for (let i = 0; i < 63; i++) {
    if (i > 0 && i % 5 === 0) result += "-"
    else result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Manipular seleção de arquivo
async function handleFileSelect(file) {
  currentFile = file

  // Mostrar informações do arquivo
  document.getElementById("fileName").textContent = file.name
  document.getElementById("fileSize").textContent = formatFileSize(file.size)
  document.getElementById("fileType").textContent = file.type || "Tipo desconhecido"

  document.getElementById("uploadArea").style.display = "none"
  document.getElementById("fileInfo").style.display = "flex"

  // Gerar hash do arquivo
  showLoading(true, "Gerando hash SHA-256...")

  try {
    currentHash = await generateFileHash(file)

    // Mostrar hash gerado
    document.getElementById("hashValue").innerHTML = `<code>${currentHash}</code>`
    document.getElementById("copyHashBtn").style.display = "inline-flex"

    // Habilitar botão de timestamp se conectado
    updateAuthenticatedState()

    showMessage("success", "Hash SHA-256 gerado com sucesso!")
  } catch (error) {
    showMessage("error", "Erro ao gerar hash do arquivo")
    console.error("Erro na geração do hash:", error)
  } finally {
    showLoading(false)
  }
}

// Gerar hash SHA-256 do arquivo
async function generateFileHash(file) {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

// Limpar arquivo selecionado
function clearFile() {
  currentFile = null
  currentHash = null

  document.getElementById("uploadArea").style.display = "block"
  document.getElementById("fileInfo").style.display = "none"
  document.getElementById("hashValue").innerHTML =
    '<span class="placeholder">Hash será gerado após selecionar arquivo</span>'
  document.getElementById("copyHashBtn").style.display = "none"
  document.getElementById("fileInput").value = ""

  updateAuthenticatedState()
}

// Copiar hash para clipboard
async function copyHash() {
  if (currentHash) {
    try {
      await navigator.clipboard.writeText(currentHash)
      showMessage("success", "Hash copiado para a área de transferência!")
    } catch (error) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea")
      textArea.value = currentHash
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      showMessage("success", "Hash copiado para a área de transferência!")
    }
  }
}

// Criar timestamp na blockchain (simulado)
async function createTimestamp() {
  if (!isConnected) {
    showMessage("error", "Conecte-se ao Internet Identity primeiro")
    return
  }

  if (!currentHash) {
    showMessage("error", "Selecione um arquivo primeiro")
    return
  }

  showLoading(true, "Registrando timestamp na blockchain ICP...")

  try {
    // Simular chamada para o canister
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Criar registro de timestamp
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

    // Salvar timestamp
    timestamps.push(timestamp)
    saveTimestamps()

    // Mostrar resultado
    showTimestampResult(timestamp)

    showMessage("success", "Timestamp registrado com sucesso na blockchain!")
  } catch (error) {
    showMessage("error", "Erro ao registrar timestamp na blockchain")
    console.error("Erro no timestamp:", error)
  } finally {
    showLoading(false)
  }
}

// Mostrar resultado do timestamp
function showTimestampResult(timestamp) {
  const resultDiv = document.getElementById("timestampResult")

  resultDiv.innerHTML = `
    <div class="timestamp-success">
      <div class="success-header">
        <i class="fas fa-check-circle"></i>
        <h3>Timestamp Registrado com Sucesso!</h3>
      </div>
      
      <div class="timestamp-details">
        <div class="detail-row">
          <label>ID do Timestamp:</label>
          <span class="monospace">${timestamp.id}</span>
        </div>
        <div class="detail-row">
          <label>Hash SHA-256:</label>
          <span class="monospace hash-display">${timestamp.hash}</span>
        </div>
        <div class="detail-row">
          <label>Principal ID:</label>
          <span class="monospace">${timestamp.principal}</span>
        </div>
        <div class="detail-row">
          <label>Arquivo:</label>
          <span>${timestamp.filename} (${formatFileSize(timestamp.filesize)})</span>
        </div>
        <div class="detail-row">
          <label>Data/Hora:</label>
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
          Copiar ID
        </button>
        <button class="btn btn-secondary" onclick="downloadCertificate('${timestamp.id}')">
          <i class="fas fa-download"></i>
          Baixar Certificado
        </button>
      </div>
      
      <div class="blockchain-proof">
        <h4><i class="fas fa-shield-alt"></i> Prova Blockchain</h4>
        <p>Este documento foi registrado permanentemente na blockchain do Internet Computer. 
        O hash, timestamp e sua identidade foram gravados de forma imutável no canister 
        <code>${timestamp.canisterId}</code>.</p>
      </div>
    </div>
  `

  resultDiv.style.display = "block"
  resultDiv.scrollIntoView({ behavior: "smooth" })
}

// Verificar timestamp existente
async function verifyTimestamp() {
  const hash = document.getElementById("verifyHash").value.trim()

  if (!hash) {
    showMessage("error", "Digite o hash do documento")
    return
  }

  if (hash.length !== 64) {
    showMessage("error", "Hash SHA-256 deve ter 64 caracteres")
    return
  }

  showLoading(true, "Verificando na blockchain...")

  try {
    // Simular verificação na blockchain
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Buscar timestamp
    const timestamp = timestamps.find((t) => t.hash === hash)
    const resultDiv = document.getElementById("verificationResult")

    if (timestamp) {
      resultDiv.innerHTML = `
        <div class="verification-success">
          <h4><i class="fas fa-check-circle"></i> Documento Verificado!</h4>
          <div class="verification-details">
            <p><strong>Arquivo:</strong> ${timestamp.filename}</p>
            <p><strong>Registrado em:</strong> ${formatTimestamp(timestamp.timestamp)}</p>
            <p><strong>Principal:</strong> <code>${timestamp.principal}</code></p>
            <p><strong>Block Height:</strong> ${timestamp.blockHeight}</p>
            <p><strong>ID:</strong> <code>${timestamp.id}</code></p>
          </div>
          <div class="verification-badges">
            <span class="badge badge-success">
              <i class="fas fa-shield-alt"></i> Autêntico
            </span>
            <span class="badge badge-info">
              <i class="fas fa-blockchain"></i> Blockchain ICP
            </span>
          </div>
        </div>
      `
      resultDiv.className = "verification-result success"
    } else {
      resultDiv.innerHTML = `
        <div class="verification-error">
          <h4><i class="fas fa-times-circle"></i> Documento Não Encontrado</h4>
          <p>O hash informado não foi encontrado na blockchain do Internet Computer.</p>
          <div class="verification-tips">
            <h5>Verifique se:</h5>
            <ul>
              <li>O hash foi copiado corretamente</li>
              <li>O documento foi registrado neste cartório</li>
              <li>Não há espaços extras no hash</li>
            </ul>
          </div>
        </div>
      `
      resultDiv.className = "verification-result error"
    }

    resultDiv.style.display = "block"
  } catch (error) {
    showMessage("error", "Erro na verificação. Tente novamente.")
    console.error("Erro na verificação:", error)
  } finally {
    showLoading(false)
  }
}

// Navegação entre seções
function showSection(sectionId) {
  // Esconder todas as seções
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Mostrar seção selecionada
  document.getElementById(sectionId).classList.add("active")
}

// Atualizar link ativo na navegação
function updateActiveNavLink(activeLink) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })
  activeLink.classList.add("active")
}

// Utilitários
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
  return date.toLocaleString("pt-BR", {
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
    showMessage("success", "ID do timestamp copiado!")
  })
}

function downloadCertificate(id) {
  const timestamp = timestamps.find((t) => t.id === id)
  if (timestamp) {
    // Simular download do certificado
    showMessage("info", `Download do certificado ${id} iniciado`)
    // Aqui seria implementada a geração real do PDF
  }
}

// Mostrar loading
function showLoading(show, message = "Processando...") {
  const overlay = document.getElementById("loadingOverlay")
  if (show) {
    overlay.querySelector("p").textContent = message
    overlay.style.display = "flex"
  } else {
    overlay.style.display = "none"
  }
}

// Mostrar mensagem
function showMessage(type, message) {
  // Remover mensagens existentes
  document.querySelectorAll(".message").forEach((msg) => msg.remove())

  // Criar nova mensagem
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

  // Inserir no topo da seção ativa
  const activeSection = document.querySelector(".section.active")
  const container = activeSection.querySelector(".container")
  container.insertBefore(messageDiv, container.firstChild)

  // Remover após 5 segundos
  setTimeout(() => {
    messageDiv.remove()
  }, 5000)
}

// Salvar e carregar dados
function saveTimestamps() {
  localStorage.setItem("icp_timestamps", JSON.stringify(timestamps))
}

function loadStoredData() {
  const savedTimestamps = localStorage.getItem("icp_timestamps")
  if (savedTimestamps) {
    timestamps = JSON.parse(savedTimestamps)
  }
}

// Adicionar estilos CSS dinâmicos
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

  .success-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    color: var(--success-color);
  }

  .success-header i {
    font-size: 2rem;
  }

  .timestamp-details {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-row label {
    font-weight: 600;
    color: var(--dark-color);
  }

  .monospace {
    font-family: 'Courier New', monospace;
    background: #e9ecef;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .hash-display {
    word-break: break-all;
    max-width: 300px;
  }

  .timestamp-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
  }

  .blockchain-proof {
    background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid var(--primary-color);
  }

  .blockchain-proof h4 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .verification-success,
  .verification-error {
    text-align: center;
  }

  .verification-details {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    text-align: left;
  }

  .verification-badges {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .badge-success {
    background: #d4edda;
    color: var(--success-color);
    border: 1px solid var(--success-color);
  }

  .badge-info {
    background: #d1ecf1;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  .verification-tips ul {
    text-align: left;
    margin-left: 1rem;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .detail-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .hash-display {
      max-width: 100%;
    }

    .timestamp-actions {
      flex-direction: column;
    }

    .verification-badges {
      flex-direction: column;
      align-items: center;
    }
  }
`

// Adicionar estilos ao documento
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)

// Exportar funções para uso global
window.showSection = showSection
window.connectInternetIdentity = connectInternetIdentity
window.createTimestamp = createTimestamp
window.verifyTimestamp = verifyTimestamp
window.clearFile = clearFile
window.copyHash = copyHash
window.copyTimestampId = copyTimestampId
window.downloadCertificate = downloadCertificate
