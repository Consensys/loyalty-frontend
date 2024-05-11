import axios from 'axios';
import React, { useState, createRef, useEffect } from 'react';
import { shortenHexString } from '../utils';
import styles from '../Styles/ContractOwnershipForm.module.scss'
import SmallButton from './SmallButton';

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
  const [isProcessing, setIsProcessing] = useState(false)
  const implementationAddressRef = createRef()
  const appNameRef = createRef()
  const [formData, setFormData] = useState({
    // todo - remove default values
    dappName: 'Kylans Dapp',
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    implementationAddress: '0x43506849D7C04F9138D1A2050bbF3A0c054402dd'
  })
  const [isProxy, setIsProxy] = useState(null)
  const [ownerAddress, setOwnerAddress] = useState(null)

  useEffect(() => {
    appNameRef.current.focus()
  }, [])

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
    setIsProcessing(true)
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
            if (isContractProxy) {
              implementationAddressRef.current.focus()
            }
            clearInterval(interval)
            resolve()
          } catch (err) {
            console.error(err)
            reject()
          }
        }, 2000)
      })
    } catch (error){
      console.error(error)
    } finally {
      setIsProcessing(false)
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
        ref={appNameRef}
        disabled={false}
        value={formData.dappName}
        type="text"
        label="Dapp name"
        variant="outlined"
        onChange={({ target: { value }}) => onChangeInput('dappName', value)}
      />
      <label>Smart contract address</label>
        <input
          className={`${isProxy && 'success'}`}
          disabled={isProxy}
          value={formData.contractAddress}
          type="text"
          label="Smart contract address"
          variant="outlined"
          onChange={({ target: { value }}) => onChangeInput('contractAddress', value)}
        /><br />
        {isProxy && (
          <>
            <label className='result success'>✓ Address registered!</label>
            <br />
          </>
        )}
        <div className={`${[null, false].includes(isProxy) && 'hidden'}`}>
          <label>Implementation contract address</label>
          <input
            ref={implementationAddressRef}
            value={formData.implementationAddress}
            disabled={false}
            type="text"
            label="Implementation contract address"
            variant="outlined"
            onChange={({ target: { value }}) => onChangeInput('implementationAddress', value)}
          />
        </div>
      {ownerAddress && (
        <div className={styles.ownerAddressWrap}>
          <span>Owner address:</span><br />
          <span>{shortenHexString(ownerAddress)} <img className={styles.copyIcon} onClick={copyToClipboard} src="/images/copy.svg" /></span>        
        </div>
      )}
      <SmallButton text="Submit" isProcessing={isProcessing} />
    </form>
  );
}