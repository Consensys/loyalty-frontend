import { ChangeEvent, FormEvent, useEffect, useState } from "react"

import { VeraxSdk } from "@verax-attestation-registry/verax-sdk"
import { useAccount } from "wagmi"
import { isAddress } from "viem"
import { lineaSepolia } from "viem/chains"
import { waitForTransactionReceipt } from "viem/actions"
import { wagmiConfig } from "../wagmi.js"
export default function Auditor() {
  const [inputValues, setInputValues] = useState({
    name: "",
    auditorAddress: "",
    contractAddress: "",
  })
  const [errors, setErrors] = useState({ commitHash: "", repoUrl: "", contractAddress: "" })
  const [veraxSdk, setVeraxSdk] = useState()
  const [txHash, setTxHash] = useState()
  const [attestationId, setAttestationId] = useState()
  const { address, chainId } = useAccount()

  const attestationConfig = {
    auditors: {
      schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
      portalId: "0x4c233dfa7b4208824221832aef38a31704ca1430",
    },
  }

  useEffect(() => {
    const myVeraxConfig = {
      chain: lineaSepolia,
      mode: "FRONTEND",
      subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v1-linea-sepolia/v0.0.1",
      portalRegistryAddress: "0x506f88a5Ca8D5F001f2909b029738A40042e42a6",
      moduleRegistryAddress: "0x3C443B9f0c8ed3A3270De7A4815487BA3223C2Fa",
      schemaRegistryAddress: "0x90b8542d7288a83EC887229A7C727989C3b56209",
      attestationRegistryAddress: "0xC765F28096F6121C2F2b82D35A4346280164428b",
    }
    if (address) {
      const sdk = new VeraxSdk(myVeraxConfig, address)
      setVeraxSdk(sdk)
    }
  }, [address])

  const handleChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value })
    validateField(e.target.name, e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Object.values(errors).every((error) => error === "")) {
      setTxHash(undefined)
      setAttestationId(undefined)
      await issueAuthorisedAdminAttestation()
    }
  }

  const validateField = (name, value) => {
    let error = ""
    switch (name) {
      case "commitHash":
        if (!/^[0-9a-f]{40}$/.test(value)) {
          error = "Commit hash is not valid. It should be a 40 character hexadecimal string."
        }
        break
      case "repoUrl":
        if (!/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(value)) {
          error =
            "GitHub repo URL is not valid. It should be in the format https://github.com/username/repo."
        }
        break
      case "contractAddress":
        if (!isAddress(value)) {
          error = "Contract address is not valid. It must be a valid Ethereum address."
        }
        break
      default:
        break
    }
    setErrors({ ...errors, [name]: error })
  }

  const issueAuthorisedAdminAttestation = async () => {
    if (address && veraxSdk) {
      try {
        let receipt = await veraxSdk.portal.attest(
          attestationConfig.auditors.portalId,
          {
            schemaId: attestationConfig.auditors.schemaId,
            expirationDate: Math.floor(Date.now() / 1000) + 2592000,
            subject: address,
            attestationData: [
              {
                name: inputValues.name,
                auditorAddress: inputValues.auditorAddress,
              },
            ],
          },
          []
        )
        if (receipt.transactionHash) {
          setTxHash(receipt.transactionHash)
          receipt = await waitForTransactionReceipt(wagmiConfig.getClient(), {
            hash: receipt.transactionHash,
          })
          setAttestationId(receipt.logs?.[0].topics[1])
        } else {
          alert(`Oops, something went wrong!`)
        }
      } catch (e) {
        console.log(e)
        if (e instanceof Error) {
          alert(`Oops, something went wrong: ${e.message}`)
        }
      }
    }
  }

  const truncateHexString = (hexString) => {
    return `${hexString.slice(0, 7)}...${hexString.slice(hexString.length - 5, hexString.length)}`
  }

  return (
    <>
      {/* <Header /> */}
      <div className={"main-container"}>
        {/* <ConnectButton /> */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={inputValues.name}
            onChange={handleChange}
            placeholder="Auditor's name"
          />
          {errors.name && <div className="error">{errors.name}</div>}
          <input
            type="text"
            name="auditorAddress"
            value={inputValues.auditorAddress}
            onChange={handleChange}
            placeholder="Auditor's address"
          />
          {errors.auditorAddress && <div className="error">{errors.auditorAddress}</div>}
          {/* <input
            type="text"
            name="contractAddress"
            value={inputValues.contractAddress}
            onChange={handleChange}
            placeholder="Smart contract address"
          />
          {errors.contractAddress && <div className="error">{errors.contractAddress}</div>} */}
          <button type="submit" disabled={!address || !veraxSdk}>
            Issue attestation
          </button>
        </form>
        {txHash && (
          <div className={"message"}>
            Transaction Hash:{" "}
            <a
              href={`${
                chainId === 59144
                  ? "https://lineascan.build/tx/"
                  : "https://goerli.lineascan.build/tx/"
              }${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateHexString(txHash)}
            </a>
          </div>
        )}
        {txHash && !attestationId && (
          <div className={"message pending"}>Transaction pending...</div>
        )}
        {attestationId && (
          <div className={"message success"}>
            Attestation ID:{" "}
            <a
              href={`${
                chainId === 59144
                  ? "https://explorer.ver.ax/linea/attestations/"
                  : "https://explorer.ver.ax/linea-testnet/attestations/"
              }${attestationId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateHexString(attestationId)}
            </a>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </>
  )
}
