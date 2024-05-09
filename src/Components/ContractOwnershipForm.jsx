import React, { useState } from 'react';

export default function ContractOwnershipForm() {
  const [formData, setFormData] = useState({
    dappName: '',
    smartContractAddress: '',
    implementationContractAddress: ''
  })

  const onChangeInput = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  return (
    <form style={{ width: 300}}>
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
        onChange={({ target: { value }}) => onChangeInput('dappName', value)}
      />
      <label>Implementation contract address</label>
      <input
        type="text"
        label="Implementation contract address"
        variant="outlined"
        onChange={({ target: { value }}) => onChangeInput('dappName', value)}
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