import axios from "axios";
import React, { useState } from "react";
import styles from "../Styles/Web3BuilderVerification.module.scss";
import Cubes from "../Images/cubes.svg";
import { useAccount, useConnect } from "wagmi";

export default function Web3BuilderVerification({ setIsVisible }) {
  const { isConnected } = useAccount();
  const [isGithubVerified, setIsGithubVerified] = useState(false);
  const [isGithubVerifyOpen, setIsGithubVerifyOpen] = useState(false);
  const [isEthereumVerified, setIsEthereumVerified] = useState(false);
  const [isMembershipNFTMinted, setIsMembershipNFTMinted] = useState(false);

  const verifyGithub = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsGithubVerifyOpen(true);
  };

  const renderVerifyGithubForm = () => {
    const onChangeInput = (value) => {
      console.log(value);
    };
    return (
      <div>
        <label>Github Account</label>
        <input
          type="text"
          variant="outlined"
          onChange={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onChangeInput(event.target.value);
          }}
        />
      </div>
    );
  };

  return (
    <form className={styles.web3BuilderVerification}>
      <div className={styles.headerWrapper}>
        <img src={Cubes} className={styles.cubesIcon} />
        <h2 className={styles.title}>Web3 Builder Verification</h2>
      </div>

      <div className={styles.step}>
        <div className={styles.divider} />
        <div style={{ marginTop: "24px" }}>
          Prove Your Builder Identity to unlock minting of your Build For
          MetaMask NFT
        </div>
        <div className={styles.stepWrapper}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.subtitle}>
            Connect your Github Account to verify code contributions.
          </div>
          {/*TODO: Change isConnected here */}
          <div
            className={`${isConnected ? styles.verifiedLabel : styles.unVerifiedLabel}`}
          >
            + 10xps
          </div>
        </div>

        {isGithubVerifyOpen ? (
          renderVerifyGithubForm()
        ) : (
          <button
            className={`${styles.smallBtn} small-btn`}
            variant="contained"
            color="primary"
            onClick={verifyGithub}
          >
            Verify
          </button>
        )}
      </div>
      <div className={styles.divider} />
      <div className={styles.step}>
        <div className={styles.stepWrapper}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.subtitle}>Verify Ethereum activity</div>
          <div
            className={`${isConnected ? styles.verifiedLabel : styles.unVerifiedLabel}`}
          >
            + 10xps
          </div>
        </div>
        <button
          className={`${styles.smallBtn} small-btn`}
          variant="contained"
          color="primary"
          type="submit"
        >
          Verify
        </button>
      </div>
      <div className={styles.divider} />
      <div className={styles.step}>
        <div className={styles.stepWrapper}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.subtitle}>
            Join the Build for MetaMask program by making your membership NFT
          </div>
        </div>
        <button
          className={`${styles.smallBtn} small-btn`}
          variant="contained"
          color="primary"
          type="submit"
        >
          Mint
        </button>
      </div>
    </form>
  );
}
