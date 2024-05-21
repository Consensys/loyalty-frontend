import axios from 'axios';
import React, { useState, createRef, useEffect } from 'react';
import SmallButton from './SmallButton';
import { useSignMessage } from 'wagmi'
import { FETCH_CONFIG } from '../constants';

// harmless-cuddly-mullet.ngrok-free.app
const SUBMIT_CONTRACT_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3j9oqgz/'
const SUBMIT_IMPLEMENTATION_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3j9bz1i/'
// const CHECK_PROXY_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/proxy/contractaddress'
// const VERIFY_OWNERSHIP_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/contractowner/contractaddress'
// const CHECK_PROXY_URL = 'https://d2a3-2804-13c-6f3-2400-6448-cb20-d2e8-6d0b.ngrok-free.app/v1/zapier/proxy/contractaddress'
// const VERIFY_OWNERSHIP_URL = 'https://d2a3-2804-13c-6f3-2400-6448-cb20-d2e8-6d0b.ngrok-free.app/v1/zapier/contractowner/contractaddress'
const CHECK_PROXY_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/proxy/contractaddress'
const VERIFY_OWNERSHIP_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/zapier/contractowner/contractaddress'
const ARB_DATA_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/owners'
const VERIFY_MESSAGE_SIGNATURE_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/owners'

export default function ContractOwnershipForm({ setIsVisible }) {
  const { data: signedMessageData, error, isLoading, signMessage, variables } = useSignMessage()
  const [message, setMessage] = useState(null)
  // const [recoveredAddress, setRecoveredAddress] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const implementationAddressRef = createRef()
  const appNameRef = createRef()
  const [formData, setFormData] = useState({
    // todo - remove default values
    dappName: '',
    contractAddress: '',
    implementationAddress: ''
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
    } // todo what if not proxy?
    if (!ownerAddress) {
      await submitVerifyOwnership()
      return
    }
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
            if (typeof isContractProxy === 'boolean') {
              clearInterval(interval)
              resolve()
              setIsProcessing(false)
            }
          } catch (err) {
            console.error(err)
            clearInterval(interval)
            reject()
            setIsProcessing(false)
          }
        }, 2000)
      })
    } catch (error){
      console.error(error)
      setIsProcessing(false)
    }
  }

  const submitVerifyOwnership = async () => {
    const { contractAddress, implementationAddress } = formData
    setIsProcessing(true)
    try {
      await axios.get(SUBMIT_IMPLEMENTATION_URL, {
        params: {
          contractAddress,
          implementationAddress
        }
      })
      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const { data: { accountAddress } } = await axios.get(
              `${VERIFY_OWNERSHIP_URL}/${contractAddress}`,
              FETCH_CONFIG
            )
            if (accountAddress) {
              clearInterval(interval)
              resolve()
              setIsProcessing(false)
              setOwnerAddress(accountAddress)
              attemptSignMessage(accountAddress)
            }
          } catch (err) {
            console.error(err)
            clearInterval(interval)
            setIsProcessing(false)
            reject()
          }
        }, 2000)
      })
    } catch (error){
      console.error(error)
      setIsProcessing(false)
    }
  }

  const attemptSignMessage = async (contractOwnerAddress) => {
    try {
      const { data: { message } } = await axios.get(
      `${ARB_DATA_URL}/${contractOwnerAddress}/message`,
      FETCH_CONFIG)
      setMessage(message)
      await signMessage({ message })
    } catch (err) {
      console.error(err)
    }
  }

  console.log('signedMessageData', signedMessageData)

  useEffect(() => {
    ;(async () => {
      console.log('in useEffect and ownerAddress is', ownerAddress)
      if (!ownerAddress || !signedMessageData) return
      try {
        const { data: { status } } = await axios.post(`${VERIFY_MESSAGE_SIGNATURE_URL}/${ownerAddress}/verify`, {
          signature: signedMessageData,
          message
        },
        FETCH_CONFIG
        )
        if (status === 200) {

        } else {
          console.error('Signature verification failed')
        }
      } catch (err) {
        console.error(err)
      }
    })()
  }, [signedMessageData, ownerAddress, variables?.message])

  return (
    <form style={{ width: 300}} onSubmit={onSubmit}>
      <h2 className="title">Prove Ownership of<br />Dapp Smart Contract</h2>
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
          disabled={isProxy || isProcessing}
          value={formData.contractAddress}
          type="text"
          label="Smart contract address"
          variant="outlined"
          onChange={({ target: { value }}) => onChangeInput('contractAddress', value)}
        /><br />
        {isProxy && (
          <>
            <label className='result success'>✓ Contract address registered!</label>
            <br />
          </>
        )}
        <div className={`${[null, false].includes(isProxy) && 'hidden'}`}>
          <label>Implementation contract address</label>
          <input
            className={`${ownerAddress && 'success'}`}
            ref={implementationAddressRef}
            value={formData.implementationAddress}
            disabled={isProcessing || ownerAddress}
            type="text"
            label="Implementation contract address"
            variant="outlined"
            onChange={({ target: { value }}) => onChangeInput('implementationAddress', value)}
          /><br />
          {ownerAddress && (
            <>
              <label className='result success'>✓ Owner address acquired</label>
              <br />
            </>
          )}          
        </div>
      {ownerAddress && (
        <>
          <SmallButton text="Verify Ownership" disabled={isProcessing} isProcessing={isProcessing} /><br />
          <SmallButton text="Verify with Test Address" disabled={isProcessing} isProcessing={isProcessing} />        
        </>
      )}
      {!ownerAddress && (
        <SmallButton text="Register" disabled={isProcessing} isProcessing={isProcessing} />
      )}<br /><br />
      {/* {recoveredAddress} */}

      {/* {true ? (
        <label className='result success' style={{ float: 'left'}}>✓ Ownership verified</label>
      ) : (
        <label className='result error' style={{ float: 'left'}}>x Ownership verification failed, please try signing from a different wallet address</label>
      )} */}
    </form>
  );
}