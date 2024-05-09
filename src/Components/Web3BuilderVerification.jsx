import axios from 'axios';
import React, { useState } from 'react';
import styles from '../Styles/Web3BuilderVerification.module.scss'

export default function Web3BuilderVerification({ setIsVisible }) {
  const [isGithubVerified, setIsGithubVerified] = useState(false)
  const [isEthereumVerified, setIsEthereumVerified] = useState(false)
  const [isMembershipNFTMinted, setIsMembershipNFTMinted] = useState(false)

  const verifyGithub = async () => {

  }

  return (
    <form style={{ width: 300}} className={styles.web3BuilderVerification}>
      <h2 className={styles.title}>Web3 Builder Verification</h2>
      <div className={styles.step}>
        <p>Connect to GitHub to verify your code contributing</p>
        <button
          className={`${styles.smallBtn} small-btn`}
          variant="contained"
          color="primary"
          type="submit"
        >
          Verify
        </button>        
      </div>
      <div className={styles.step}>
        <p>Verify Ethereum activity</p>
        <button
          className={`${styles.smallBtn} small-btn`}
          variant="contained"
          color="primary"
          type="submit"
        >
          Verify
        </button>        
      </div>
      <div className={styles.step}>
        <p>Join the Build for MetaMask program by making your membership NFT</p>        
        <button
          className={`${styles.smallBtn} small-btn`}
          variant="contained"
          color="primary"
          type="submit"
        >
          Verify
        </button>  
      </div>
    </form>
  );
}