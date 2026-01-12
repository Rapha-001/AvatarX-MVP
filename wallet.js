document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // 1️⃣ Configuration
  // -----------------------------
  const projectId = "YOUR_WALLETCONNECT_PROJECT_ID" // replace with your ID
  let provider, signer

  // -----------------------------
  // 2️⃣ Initialize Web3Modal (v2)
  // -----------------------------
  const web3Modal = new window.Web3Modal.default({
    projectId,
    themeMode: "light",
    walletConnectVersion: 2
  })

  // -----------------------------
  // 3️⃣ Get DOM elements
  // -----------------------------
  const connectBtn = document.getElementById("connectBtn")
  const sendBtn = document.getElementById("sendBtn")
  const addressEl = document.getElementById("address")
  const paymentEl = document.getElementById("payment")
  const statusEl = document.getElementById("status")

  const tokenInput = document.getElementById("token")
  const toInput = document.getElementById("to")
  const amountInput = document.getElementById("amount")

  // -----------------------------
  // 4️⃣ Minimal ERC-20 ABI
  // -----------------------------
  const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function decimals() view returns (uint8)"
  ]

  // -----------------------------
  // 5️⃣ Connect Wallet
  // -----------------------------
  connectBtn.onclick = async () => {
    try {
      statusEl.innerText = "Connecting..."
      const instance = await web3Modal.connect()

      // ethers v6
      provider = new ethers.BrowserProvider(instance)
      signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      addressEl.innerText = userAddress
      paymentEl.style.display = "block"
      statusEl.innerText = "Wallet connected ✅"
    } catch (err) {
      console.error(err)
      statusEl.innerText = "Connection failed ❌"
    }
  }

  // -----------------------------
  // 6️⃣ Send ERC-20 Payment
  // -----------------------------
  sendBtn.onclick = async () => {
    const tokenAddr = tokenInput.value.trim()
    const recipient = toInput.value.trim()
    const amount = amountInput.value.trim()

    if (!signer) {
      statusEl.innerText = "Connect wallet first!"
      return
    }
    if (!ethers.isAddress(tokenAddr) || !ethers.isAddress(recipient)) {
      statusEl.innerText = "Invalid token or recipient address"
      return
    }
    if (!amount || Number(amount) <= 0) {
      statusEl.innerText = "Enter a positive amount"
      return
    }

    try {
      statusEl.innerText = "Preparing transaction..."
      const token = new ethers.Contract(tokenAddr, ERC20_ABI, signer)
      const decimals = await token.decimals()
      const value = ethers.parseUnits(amount, decimals)

      statusEl.innerText = "Sending transaction..."
      const tx = await token.transfer(recipient, value)
      statusEl.innerText = `Tx sent: ${tx.hash} (waiting for confirmation...)`
      await tx.wait()
      statusEl.innerText = `Transaction confirmed ✅ (hash: ${tx.hash})`
    } catch (err) {
      console.error(err)
      statusEl.innerText = `Error: ${err.message || err}`
    }
  }

})