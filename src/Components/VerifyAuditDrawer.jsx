import React, { useState, useEffect } from "react"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Web3 from "web3"
import { lineaSepolia } from "viem/chains"
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk"
import { useAccount } from "wagmi"
import { verifyMessage } from "@wagmi/core"

import { wagmiConfig } from "../wagmi"

function VerifyAuditDrawer({ isOpen, toggleDrawer }) {
  const [contractAddress, setContractAddress] = useState("")
  const [auditorAddress, setAuditorAddress] = useState("")
  const [veraxSdk, setVeraxSdk] = useState()
  const { address, chainId } = useAccount()
  const [web3, setWeb3] = useState()

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

  const handleContractAddressChange = (event) => {
    setContractAddress(event.target.value)
  }

  const handleAuditorAddressChange = (event) => {
    setAuditorAddress(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault() // Prevent the form from refreshing the page
    try {
      const bytecode = await web3.eth.getCode(contractAddress)
      console.log("Bytecode:", bytecode)
      const hash = web3.utils.sha3(bytecode)
      const myAttestations = await veraxSdk.attestation.findBy(
        500,
        0,
        { attester: auditorAddress.toLowerCase() },
        "attestedDate",
        "desc"
      )

      const myAttestation = myAttestations.find((a) => {
        console.log("Attestation:", a)
        return a.decodedPayload[0].byteCodeHash?.toLowerCase() === hash.toLowerCase()
      })
      const { auditorSignature, byteCodeHash } = myAttestation.decodedPayload[0]

      const valid = await verifyMessage(wagmiConfig, {
        address: auditorAddress,
        message: byteCodeHash,
        signature: auditorSignature,
      })
      console.log("Valid:", valid)
      if (valid) {
        alert("Audit Verified")
      }
      console.log(`>>>>> Hash: ${hash}`)
    } catch (error) {
      console.error("Error fetching bytecode:", error)
    }
    // toggleDrawer(false)()
  }

  const formList = () => (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.50)",
        color: "white",
      }}
      role="presentation"
    >
      <form onSubmit={handleSubmit}>
        <List>
          <ListItem>
            <TextField
              label="Contract Address"
              variant="outlined"
              fullWidth
              value={contractAddress}
              onChange={handleContractAddressChange}
              inputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </ListItem>
          <ListItem>
            <TextField
              label="Auditor Address"
              variant="outlined"
              fullWidth
              value={auditorAddress}
              onChange={handleAuditorAddressChange}
              inputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "white" } }}
            />
          </ListItem>
          <ListItem>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Verify Audit
            </Button>
          </ListItem>
        </List>
      </form>
    </Box>
  )

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={toggleDrawer(false)}
      sx={{ "& .MuiDrawer-paper": { width: "25%" } }}
    >
      {formList()}
    </Drawer>
  )
}

export default VerifyAuditDrawer
