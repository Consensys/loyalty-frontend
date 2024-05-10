import axios from 'axios';
import React, { useState } from 'react';
import { shortenHexString } from '../utils';
import styles from '../Styles/ContractOwnershipForm.module.scss'

const FETCH_CONFIG = {
  headers: {
    'X-API-KEY': '375262ce-c3d0-4609-a325-ec2831a071b4',
    accept: 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning'
  }
}

const SUBMIT_CONTRACT_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3j9oqgz/'
const SUBMIT_IMPLEMENTATION_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3j9bz1i/'
const CHECK_PROXY_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/proxy/contractaddress'
const VERIFY_OWNERSHIP_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/contractowner/contractaddress'

export default function ContractOwnershipForm({ setIsVisible }) {
  const [formData, setFormData] = useState({
    dappName: '',
    contractAddress: '',
    implementationAddress: ''
  })
  const [isProxy, setIsProxy] = useState(null)
  const [ownerAddress, setOwnerAddress] = useState(null)

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
    const { contractAddress } = formData
    try {
      await axios.get(SUBMIT_CONTRACT_URL, {
        params: {
          address: formData.contractAddress,
        }
      })
      return new Promise((resolve, reject) => {
        let interval = setInterval(async () => {
          try {
            const { data: { isProxy: isContractProxy }} = await axios.get(`${CHECK_PROXY_URL}/${contractAddress}`, FETCH_CONFIG)
            setIsProxy(isContractProxy)
            clearInterval(interval)
            resolve()
          } catch (err) {
            console.error(err)
            reject()
          }
        }, 5000)
      })
    } catch (error){
      console.error(error)
    } finally {
      // do something
    }    
  }

  const submitVerifyOwnership = async () => {
    const { contractAddress, implementationAddress } = formData
    try {
      await axios.get(SUBMIT_IMPLEMENTATION_URL, {
        params: {
          contractAddress,
          implementationAddress
        }
      })
      return new Promise((resolve, reject) => {
        setInterval(async () => {
          try {
            const { data: { accountAddress } } = await axios.get(`${VERIFY_OWNERSHIP_URL}/${contractAddress}`, FETCH_CONFIG)
            setOwnerAddress(accountAddress)
            resolve()
          } catch (err) {
            console.error(err)
            reject()
          }
        }, 5000)
      })
    } catch (error){
      console.error(error)
    } finally {
      // do something
    }
  }

  const copyToClipboard = () => {
    console.log('copyToClipboard', ownerAddress)
    navigator.clipboard.writeText(ownerAddress)
  }

  return (
    <form style={{ width: 300}} onSubmit={onSubmit}>
      <h2 className="title">Prove Ownership of<br />Dapp Smart-Contract</h2>
      <p>Prove that you own your Dapp smart contract</p>
      <p className="instructions">Enter your dapp smart contract address below to start the verification process</p>
      <label>Dapp name</label>
      <input
        disabled={false}
        type="text"
        label="Dapp name"
        variant="outlined"
        onChange={({ target: { value }}) => onChangeInput('dappName', value)}
      />
      <label>Smart contract address</label>
      <input
        disabled={isProxy}
        type="text"
        label="Smart contract address"
        variant="outlined"
        onChange={({ target: { value }}) => onChangeInput('contractAddress', value)}
      />
      {isProxy !== null && (
        <>
        <label>Implementation contract address</label>
          <input
            disabled={false}
            type="text"
            label="Implementation contract address"
            variant="outlined"
            onChange={({ target: { value }}) => onChangeInput('implementationAddress', value)}
          />        
        </>
      )}
      {ownerAddress && (
        <div className={styles.ownerAddressWrap}>
          <span>Owner address:</span><br />
          <span>{shortenHexString(ownerAddress)} <img className={styles.copyIcon} onClick={copyToClipboard} src="/images/copy.svg" /></span>        
        </div>
      )}
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