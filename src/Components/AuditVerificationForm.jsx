import axios from "axios"
import React, { useState, useEffect } from "react"
import { CircularProgress, Button, Box } from "@mui/material"

import { lineaSepolia } from "viem/chains"
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk"
import { useAccount } from "wagmi"
import { verifyMessage } from "@wagmi/core"
import Web3 from "web3"
import { wagmiConfig } from "../wagmi"

const SUBMIT_CONTRACT_URL = "https://hooks.zapier.com/hooks/catch/9914807/3j9oqgz/"
const SUBMIT_IMPLEMENTATION_URL = "https://hooks.zapier.com/hooks/catch/9914807/3j9bz1i/"
const CHECK_PROXY_URL = "https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/proxycontract"
const VERIFY_OWNERSHIP_URL = "https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/contractowner"

export default function AuditVerificationForm({ setIsVisible }) {
  const [formData, setFormData] = useState({
    contractAddress: "",
    implementationAddress: "",
    auditorAddress: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const [veraxSdk, setVeraxSdk] = useState()
  const { address } = useAccount()
  const [web3, setWeb3] = useState()
  const [isProxy, setIsProxy] = useState(null)

  useEffect(() => {
    ;(async () => {
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
        const web3 = new Web3(
          Web3.givenProvider || "https://mainnet.infura.io/v3/9a11e811139448cb9ebb23a7757323b3"
        )
        setWeb3(web3)
        setVeraxSdk(sdk)
      }
    })()
  }, [address])

  const onChangeInput = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    })
  }

  const onSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault()
    if (isProxy === null) {
      await submitIsProxy()
      return
    }
    await submitAuditProof()
  }

  const submitIsProxy = async () => {
    try {
      await axios.get(SUBMIT_CONTRACT_URL, {
        params: {
          address: formData.contractAddress,
        },
      })
      return new Promise((resolve, reject) => {
        let interval = setInterval(async () => {
          const {
            data: { isProxy: isContractProxy },
          } = await axios.get(CHECK_PROXY_URL, {
            params: {
              address: formData.contractAddress,
            },
          })
          setIsProxy(isContractProxy)
          clearInterval(interval)
          resolve()
        }, 5000)
      })
    } catch (error) {
      console.error(error)
    } finally {
      // do something
    }
  }

  const submitAuditProof = async () => {
    const addressToUse = isProxy ? formData.implementationAddress : formData.contractAddress
    try {
      const bytecode = await web3.eth.getCode(addressToUse)
      console.log("Bytecode:", bytecode)
      const hash = web3.utils.sha3(bytecode)
      const myAttestations = await veraxSdk.attestation.findBy(
        500,
        0,
        { attester: formData.auditorAddress.toLowerCase() },
        "attestedDate",
        "desc"
      )

      const myAttestation = myAttestations.find((a) => {
        console.log("Attestation:", a)
        return a.decodedPayload[0].byteCodeHash?.toLowerCase() === hash.toLowerCase()
      })
      const { auditorSignature, byteCodeHash } = myAttestation.decodedPayload[0]

      const valid = await verifyMessage(wagmiConfig, {
        address: formData.auditorAddress,
        message: byteCodeHash,
        signature: auditorSignature,
      })
      console.log("Valid:", valid)
      setIsLoading(false)
      if (valid) {
        alert("Audit Verified")
      }
      console.log(`>>>>> Hash: ${hash}`)
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching bytecode:", error)
    }
  }

  return (
    <form style={{ width: 300 }} onSubmit={onSubmit}>
      <h2 className="title">Prove Smart-Contract Audit</h2>
      <p>Prove that your Dapp smart-contract has been audited.</p>
      <p className="instructions">
        Enter your dapp smart contract address below to start the verification process
      </p>

      <label>Smart contract address</label>
      <input
        type="text"
        label="Smart contract address"
        variant="outlined"
        onChange={({ target: { value } }) => onChangeInput("contractAddress", value)}
      />
      <label>Implementation contract address</label>
      <input
        type="text"
        label="Implementation contract address"
        variant="outlined"
        onChange={({ target: { value } }) => onChangeInput("implementationAddress", value)}
      />
      <label>Auditor address</label>
      <input
        type="text"
        label="Auditor address"
        variant="outlined"
        onChange={({ target: { value } }) => onChangeInput("auditorAddress", value)}
      />
      <button className="small-btn" variant="contained" color="primary" type="submit">
        {isLoading ? <CircularProgress size={24} /> : "Verify Audit"}
      </button>
    </form>
  )
}
