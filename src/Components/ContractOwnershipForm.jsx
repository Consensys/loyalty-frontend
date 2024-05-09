import axios from 'axios';
import React, { useState } from 'react';

const SUBMIT_CONTRACT_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3j9oqgz/'
const SUBMIT_IMPLEMENTATION_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3j9bz1i/'
const CHECK_PROXY_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/proxycontract'
const VERIFY_OWNERSHIP_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/contractowner'

export default function ContractOwnershipForm({ setIsVisible }) {
  const [formData, setFormData] = useState({
    dappName: '',
    contractAddress: '',
    implementationAddress: ''
  })
  const [isProxy, setIsProxy] = useState(null)

  const onChangeInput = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (isProxy === null) {
      await submitIsProxy()
      return
    }
    await submitVerifyOwnership()
  }

  const submitIsProxy = async () => {
    try {
      await axios.get(SUBMIT_CONTRACT_URL, {
        params: {
          address: formData.contractAddress,
        }
      })
      return new Promise((resolve, reject) => {
        let interval = setInterval(async () => {
          const { data: { isProxy: isContractProxy }} = await axios.get(CHECK_PROXY_URL, {
            params: {
              address: formData.contractAddress,
            }
          })
          setIsProxy(isContractProxy)
          clearInterval(interval)
          resolve()
        }, 5000)
      })
    } catch (error){
      console.error(error)
    } finally {
      // do something
    }    
  }

  const submitVerifyOwnership = async () => {
    const addressToUse = isProxy ? formData.implementationAddress : formData.contractAddress
    try {
      await axios.get(SUBMIT_IMPLEMENTATION_URL, {
        params: {
          address: addressToUse,
        }
      })
    } catch (error){
      console.error(error)
    } finally {
      // do something
    }
  }

  return (
    <form style={{ width: 300}} onSubmit={onSubmit}>
      <h2 className="title">Prove Ownership of<br />Dapp Smart-Contract</h2>
      <p>Prove that you own your Dapp smart contract</p>
      <p className="instructions">Enter your dapp smart contract address below to start the verification process</p>
      <label>Dapp name</label>
      <input
        type="text"
        label="Dapp name"
        variant="outlined"
        onChange={({ target: { value }}) => onChangeInput('dappName', value)}
      />
      <label>Smart contract address</label>
      <input
        type="text"
        label="Smart contract address"
        variant="outlined"
        onChange={({ target: { value }}) => onChangeInput('contractAddress', value)}
      />
      <label>Implementation contract address</label>
      <input
        type="text"
        label="Implementation contract address"
        variant="outlined"
        onChange={({ target: { value }}) => onChangeInput('implementationAddress', value)}
      />
      <button
        className="small-btn"
        variant="contained"
        color="primary"
        type="submit"
      >
        Register
      </button>
    </form>
  );
}