import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    connectButton.innerHTML = "Connected!"
  } else {
    connectButton.innerHTML = "Please Install Metamask"
  }
}
async function fund() {
  const ethamount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethamount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const resp = await contract.fund({
        value: ethers.utils.parseEther(ethamount),
      })
      await listenForTransactionMin(resp, provider)
    } catch (err) {
      console.log(err)
    }
  }
}
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    balanceButton.innerHTML = ethers.utils.formatEther(balance)
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const resp = await contract.withdraw()
      await listenForTransactionMin(resp, provider)
    } catch (err) {
      console.log(err)
    }
  }
}

function listenForTransactionMin(resp, provider) {
  return new Promise((resolve, reject) => {
    provider.once(resp.hash, (respre) => {
      resolve()
    })
  })
}
