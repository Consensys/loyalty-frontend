import axios from "axios";
import React, { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import Snackbar from "@mui/material/Snackbar";
import styles from "../Styles/Web3BuilderVerification.module.scss";
import Cubes from "../Images/cubes.svg";
import { FETCH_CONFIG, API_ENDPOINT } from "../constants";
import { useToastHook } from "../Context/UseToastHook";
import Close from "../Images/close.svg";
import Check from "../Images/check.svg";

export default function Web3BuilderVerification({ setIsVisible }) {
  const { isConnected, address } = useAccount();
  const { isToastOpen, handleOpenToast, handleCloseToast } = useToastHook();
  const [toastMessage, setToastMessage] = useState("");

  const [githubAccountValue, setGithubAccountValue] = useState("");
  const [isGithubVerified, setIsGithubVerified] = useState(false);
  const [isGithubVerifyOpen, setIsGithubVerifyOpen] = useState(false);

  const [isEthereumVerified, setIsEthereumVerified] = useState(false);
  const [isMembershipNFTMinted, setIsMembershipNFTMinted] = useState(false);

  const stopEventBubbling = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const openVerifyGithubForm = async (event) => {
    stopEventBubbling(event);
    setIsGithubVerifyOpen(true);
  };

  const renderVerifyGithubForm = () => {
    const onChangeInput = (value) => {
      setGithubAccountValue(value);
    };

    const VerifyGithubAccount = async (event) => {
      stopEventBubbling(event);
      // try {
      //   const {
      //     data,
      //   } = await axios.post(
      //     'http://f3ae-109-255-0-100.ngrok-free.app/v1/stamps/git/verify/0xc2326247DFf1e185874DC22CE7A26eFcF7FC39f3/user/dddddanica',
      //     FETCH_CONFIG,
      //   );
      //   console.log({ data })
      // setToastMessage("GitHub verification succeeded")
      // } catch (err) {
      // setToastMessage("GitHub verification failed. Please try again.")
      // handleOpenToast();
      // }
      // TODO: Only on success
      setIsGithubVerified(true);
      setIsGithubVerifyOpen(false);
    };

    return (
      <div>
        <label>Github Account: </label>
        <div className={styles.githubVerifyWrapper}>
          <input
            type="text"
            variant="outlined"
            className={styles.input}
            onChange={(event) => {
              onChangeInput(event.target.value);
            }}
          />
          <button
            className={`${styles.smallBtn} small-btn`}
            variant="contained"
            color="primary"
            onClick={VerifyGithubAccount}
          >
            Verify
          </button>
        </div>
      </div>
    );
  };

  const handleVerifyEth = (event) => {
    stopEventBubbling(event);
    // try {
    //   const {
    //     data,
    //   } = await axios.post(
    //     'http://f3ae-109-255-0-100.ngrok-free.app/v1/stamps/eth/verify/0x95b3045f2daaA24e864D4983EA7c6CcbF5C3da1C',
    //     FETCH_CONFIG,
    //   );
    //   console.log({ data })
    //   setToastMessage("Verify Ethereum activity verification succeeded")
    // } catch (err) {
    // setToastMessage("Verify Ethereum activity verification failed. Please try again.")
    // handleOpenToast();
    // }
    // TODO: Only on success
    setIsEthereumVerified(true);
  };

  return (
    <form className={styles.web3BuilderVerification}>
      <div className={styles.headerWrapper}>
        <img src={Cubes} className={styles.cubesIcon} />
        <h2>Web3 Builder Verification</h2>
      </div>

      <div className={styles.step}>
        <div className={styles.divider} />
        <div style={{ marginTop: "24px" }}>
          Prove Your Builder Identity to unlock minting of your Build For
          MetaMask NFT
        </div>
        <div className={styles.stepWrapper}>
          {isGithubVerified ? (
            <img src={Check} className={styles.checkIcon} />
          ) : (
            <div className={styles.stepNumber}>1</div>
          )}
          <div className={styles.subtitle}>
            Connect your Github Account to verify code contributions.
          </div>
          <div
            className={`${isGithubVerified ? styles.verifiedLabel : styles.unVerifiedLabel}`}
          >
            + 10xps
          </div>
        </div>

        {isGithubVerifyOpen && renderVerifyGithubForm()}
        {!isGithubVerified && !isGithubVerifyOpen && (
          <button
            className={`${styles.smallBtn} small-btn`}
            variant="contained"
            color="primary"
            onClick={openVerifyGithubForm}
          >
            Verify
          </button>
        )}
      </div>
      <div className={styles.divider} />
      <div className={styles.step}>
        <div className={styles.stepWrapper}>
          {isEthereumVerified ? (
            <img src={Check} className={styles.checkIcon} />
          ) : (
            <div className={styles.stepNumber}>2</div>
          )}
          <div className={styles.subtitle}>Verify Ethereum activity</div>
          <div
            className={`${isEthereumVerified ? styles.verifiedLabel : styles.unVerifiedLabel}`}
          >
            + 10xps
          </div>
        </div>
        {!isEthereumVerified && (
          <button
            className={`${styles.smallBtn} small-btn`}
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleVerifyEth}
          >
            Verify
          </button>
        )}
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isToastOpen}
        autoHideDuration={3000}
        onClose={handleOpenToast}
        message={toastMessage}
        action={<img src={Close} />}
      />
    </form>
  );
}
