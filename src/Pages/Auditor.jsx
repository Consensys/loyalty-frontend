import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { useAccount, useSignMessage } from "wagmi";
import { isAddress } from "viem";
import { lineaSepolia } from "viem/chains";
import { waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "../wagmi.js";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Web3 from "web3";
const CustomTextField = styled(TextField)({
  margin: "10px 0",
});

export default function Auditor() {
  const [inputValues, setInputValues] = useState({
    name: "",
    auditorAddress: "",
    contractAddress: "",
    commitHash: "",
    repoUrl: "",
    contractBytecode: "",
    contractBytecodeHash: "",
    auditorSignature: "",
  });
  const [byteCodeHash, setByteCodeHash] = useState();
  const [errors, setErrors] = useState({
    commitHash: "",
    repoUrl: "",
    contractAddress: "",
  });
  const [veraxSdk, setVeraxSdk] = useState();
  const [web3, setWeb3] = useState();
  const [txHash, setTxHash] = useState();
  const [attestationId, setAttestationId] = useState();
  const { address, chainId } = useAccount();
  const {
    data: signMessageData,
    error,
    isLoading,
    signMessage,
    variables,
  } = useSignMessage();

  const attestationConfig = {
    auditors: {
      schemaId:
        "0x38decc6b43074bf3b8a6d651f4a869e0895df1f05670bd55091e9dcf3f2d5bd6",
      portalId: "0x4c233dfa7b4208824221832aef38a31704ca1430",
      schema: `(string name, string auditorAddress)`,
    },
    auditProof: {
      schemaId:
        "0xa79c2c15f0532dd6d76f721e0678ccb9caf25409649360e2d351dfcc21fd9679",
      portalId: "0x4c233dfa7b4208824221832aef38a31704ca1430",
      schema: `(string commitHash, string repoUrl, string contractBytecode, string auditorSignature)`,
    },
  };

  useEffect(() => {
    (async () => {
      const myVeraxConfig = {
        chain: lineaSepolia,
        mode: "FRONTEND",
        subgraphUrl:
          "https://api.studio.thegraph.com/query/67521/verax-v1-linea-sepolia/v0.0.1",
        portalRegistryAddress: "0x506f88a5Ca8D5F001f2909b029738A40042e42a6",
        moduleRegistryAddress: "0x3C443B9f0c8ed3A3270De7A4815487BA3223C2Fa",
        schemaRegistryAddress: "0x90b8542d7288a83EC887229A7C727989C3b56209",
        attestationRegistryAddress:
          "0xC765F28096F6121C2F2b82D35A4346280164428b",
      };
      if (address) {
        const sdk = new VeraxSdk(myVeraxConfig, address);
        const web3 = new Web3(
          Web3.givenProvider ||
            "https://mainnet.infura.io/v3/9a11e811139448cb9ebb23a7757323b3",
        );
        setWeb3(web3);
        setVeraxSdk(sdk);
        console.log(`>>>>> ${isLoading}, ${error}, ${variables}`);
        if (variables?.message && signMessageData) {
          console.log("Signed message:", signMessageData.signature);
          setInputValues({ ...inputValues, auditorSignature: signMessageData });
        }
      }
    })();
  }, [address, signMessageData, variables, isLoading, error, inputValues]);

  const handleChange = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
    validateField(e.target.name, e.target.value);
  };

  const handleAuthorisedAuditorSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).every((error) => error === "")) {
      setTxHash(undefined);
      setAttestationId(undefined);
      await issueAuthorisedAdminAttestation();
    }
  };

  const handleAuditProofSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).every((error) => error === "")) {
      setTxHash(undefined);
      setAttestationId(undefined);
      await issueAuditProofAttestation();
    }
  };

  const handleSignBytecode = async () => {
    try {
      const hashedBytecode = web3.utils.sha3(inputValues.contractBytecode);
      setInputValues({
        ...inputValues,
        auditorSignature: "",
        contractBytecodeHash: hashedBytecode,
      });
      setByteCodeHash(hashedBytecode);
      signMessage({ message: hashedBytecode });
      console.log(`>>>>>`);
    } catch (error) {
      console.error("Error signing the message:", error);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "commitHash":
        if (!/^[0-9a-f]{40}$/.test(value)) {
          error =
            "Commit hash is not valid. It should be a 40 character hexadecimal string.";
        }
        break;
      case "repoUrl":
        if (!/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(value)) {
          error =
            "GitHub repo URL is not valid. It should be in the format https://github.com/username/repo.";
        }
        break;
      case "contractAddress":
        if (!isAddress(value)) {
          error =
            "Contract address is not valid. It must be a valid Ethereum address.";
        }
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

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
          [],
        );
        if (receipt.transactionHash) {
          setTxHash(receipt.transactionHash);
          receipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: receipt.transactionHash,
          });
          setAttestationId(receipt.logs?.[0].topics[1]);
        } else {
          alert(`Oops, something went wrong!`);
        }
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          alert(`Oops, something went wrong: ${e.message}`);
        }
      }
    }
  };

  const issueAuditProofAttestation = async () => {
    if (address && veraxSdk) {
      try {
        let receipt = await veraxSdk.portal.attest(
          attestationConfig.auditProof.portalId,
          {
            schemaId: attestationConfig.auditProof.schemaId,
            expirationDate: Math.floor(Date.now() / 1000) + 2592000,
            subject: address,
            attestationData: [
              {
                commitHash: inputValues.commitHash,
                repoUrl: inputValues.repoUrl,
                byteCodeHash: inputValues.contractBytecodeHash,
                auditorSignature: inputValues.auditorSignature,
              },
            ],
          },
          [],
        );
        if (receipt.transactionHash) {
          setTxHash(receipt.transactionHash);
          receipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: receipt.transactionHash,
          });
          console.log(`>>>>> ${receipt.logs?.[0].topics[1]}`);
          setAttestationId(receipt.logs?.[0].topics[1]);
        } else {
          alert(`Oops, something went wrong!`);
        }
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          alert(`Oops, something went wrong: ${e.message}`);
        }
      }
    }
  };

  const truncateHexString = (hexString) => {
    return `${hexString.slice(0, 7)}...${hexString.slice(hexString.length - 5, hexString.length)}`;
  };

  return (
    <>
      <Box
        sx={{
          padding: "20px",
          maxWidth: "500px",
          margin: "auto",
          backgroundColor: "#333", // Dark grey, softer than pure black
          color: "white", // White text for readability
          borderRadius: "8px", // Slightly rounded corners for a smoother look
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Subtle shadow to lift the form off the page
          "& .MuiTextField-root": {
            // Styling for all text fields inside the Box
            margin: "10px 0",
            borderColor: "rgba(255, 255, 255, 0.7)", // Lighter border for the text fields
            "& label": {
              color: "rgba(255, 255, 255, 0.7)", // Light color for labels to be clearly visible
            },
            "& input": {
              color: "white", // White input text color
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.7)", // Light grey border around the input
              },
              "&:hover fieldset": {
                borderColor: "white", // Brighter border on hover for a nice effect
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6200ea", // Highlight color when focused (e.g., MUI's deep purple)
              },
            },
            "& .Mui-error": {
              "& fieldset": {
                borderColor: "#ff1744", // Red border for error states
              },
            },
          },
          "& .MuiButton-root": {
            // Styling for all buttons inside the Box
            marginTop: "20px",
            backgroundColor: "#6200ea", // Deep purple button for a vivid contrast
            color: "white",
            "&:hover": {
              backgroundColor: "#7c4dff", // Lighter purple on hover
            },
            "&:disabled": {
              backgroundColor: "#9e9e9e", // Grey out disabled buttons
            },
          },
        }}
      >
        <form onSubmit={handleAuthorisedAuditorSubmit}>
          <CustomTextField
            type="text"
            name="name"
            label="Auditor's name"
            variant="outlined"
            fullWidth
            value={inputValues.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <CustomTextField
            type="text"
            name="auditorAddress"
            label="Auditor's address"
            variant="outlined"
            fullWidth
            value={inputValues.auditorAddress}
            onChange={handleChange}
            error={!!errors.auditorAddress}
            helperText={errors.auditorAddress}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!address || !veraxSdk}
          >
            Issue attestation
          </Button>
        </form>
        {txHash && (
          <Box sx={{ marginTop: "20px" }}>
            Transaction Hash:{" "}
            <a
              href={`${"https://sepolia.lineascan.build/tx/"}${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateHexString(txHash)}
            </a>
          </Box>
        )}
        {txHash && !attestationId && (
          <Box sx={{ marginTop: "20px", color: "gray" }}>
            Transaction pending...
          </Box>
        )}
        {attestationId && (
          <Box sx={{ marginTop: "20px", color: "green" }}>
            Attestation ID:{" "}
            <a
              href={`https://api.studio.thegraph.com/proxy/67521/verax-v1-linea-sepolia/v0.0.1/graphql?query=query+MyQuery+%7B%0A++attestation%28id%3A+%22${attestationId}%22%29+%7B%0A++++attestationData%0A++++attestedDate%0A++++attester%0A++++decodedData%0A++++encodedSubject%0A++++expirationDate%0A++++portal%0A++++id%0A++++replacedBy%0A++++revocationDate%0A++++revoked%0A++++schemaId%0A++++schemaString%0A++++subject%0A++++version%0A++%7D%0A%7D`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateHexString(attestationId)}
            </a>
          </Box>
        )}
        <form onSubmit={handleAuditProofSubmit} style={{ marginTop: "20px" }}>
          {/* <CustomTextField
            type="text"
            name="commitHash"
            label="Commit hash"
            variant="outlined"
            fullWidth
            value={inputValues.commitHash}
            onChange={handleChange}
            error={!!errors.commitHash}
            helperText={errors.commitHash}
          />
          <CustomTextField
            type="text"
            name="repoUrl"
            label="GitHub repo URL"
            variant="outlined"
            fullWidth
            value={inputValues.repoUrl}
            onChange={handleChange}
            error={!!errors.repoUrl}
            helperText={errors.repoUrl}
          /> */}
          <CustomTextField
            type="text"
            name="contractBytecode"
            label="Contract bytecode"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={inputValues.contractBytecode}
            onChange={handleChange}
          />
          <CustomTextField
            type="text"
            name="auditorSignature"
            label="Auditor's signature"
            variant="outlined"
            fullWidth
            value={inputValues.auditorSignature}
            onChange={handleChange}
          />
          <Button
            type="button"
            onClick={handleSignBytecode}
            variant="contained"
            color="primary"
            fullWidth
          >
            Sign Bytecode
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!address || !veraxSdk || !byteCodeHash}
          >
            Issue Proof of Audit attestation
          </Button>
        </form>
      </Box>
    </>
  );
}
