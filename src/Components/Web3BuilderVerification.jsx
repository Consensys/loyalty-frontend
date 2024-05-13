import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import styles from "../Styles/Web3BuilderVerification.module.scss";
import Cubes from "../Images/cubes.svg";
import { FETCH_CONFIG, LEVELS_IDS, PHOSPHOR_API_KEY } from "../constants";
import Close from "../Images/close.svg";
import Check from "../Images/check.svg";

const API_ENDPOINT = "https://0117-109-255-0-100.ngrok-free.app";

export default function Web3BuilderVerification({ setIsVisible }) {
  const { isConnected, address } = useAccount();

  const [isToastOpen, setIsToastOpen] = useState(false);

  const handleOpenToast = () => setIsToastOpen(true);

  const handleCloseToast = () => setIsToastOpen(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const [githubAccountValue, setGithubAccountValue] = useState("");
  const [isGithubVerified, setIsGithubVerified] = useState(false);
  const [isGithubVerifyOpen, setIsGithubVerifyOpen] = useState(false);

  const [isEthereumVerified, setIsEthereumVerified] = useState(false);
  const [isMintLoading, setIsMintLoading] = useState(false);
  const [isMembershipNFTMinted, setIsMembershipNFTMinted] = useState(false);
  const [nftTransactionId, setNFTTransactionId] = useState(undefined);

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
      try {
        await axios.post(
          `${API_ENDPOINT}/v1/stamps/git/verify/${address}/user/${githubAccountValue}`,
          FETCH_CONFIG,
        );
        setToastType("success");
        setToastMessage("GitHub verification succeeded !");
        handleOpenToast();
        setIsGithubVerified(true);
        setIsGithubVerifyOpen(false);
      } catch (err) {
        setToastType("error");
        setToastMessage("GitHub verification failed. Please try again.");
        handleOpenToast();
      }
      setTimeout(() => handleCloseToast(), 5000);
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

  const handleVerifyEth = async (event) => {
    stopEventBubbling(event);
    try {
      await axios.post(
        `${API_ENDPOINT}/v1/stamps/eth/verify/${address}`,
        FETCH_CONFIG,
      );
      setToastType("success");
      setToastMessage("Ethereum activity succeeded !");
      handleOpenToast();
      setIsEthereumVerified(true);
    } catch (err) {
      setToastType("failure");
      setToastMessage("GitHub verification failed. Please try again.");
      handleOpenToast();
    }
    setTimeout(() => handleCloseToast(), 5000);
  };

  const handleMintNFT = (event) => {
    stopEventBubbling(event);
    setIsMintLoading(true);
    axios
      .post(
        "https://admin-api.phosphor.xyz/v1/mint-requests",
        {
          item_id: LEVELS_IDS.EXPLORER,
          quantity: "1",
          to_address: address,
        },
        {
          headers: {
            "Phosphor-Api-Key": PHOSPHOR_API_KEY,
          },
        },
      )
      .then(function (response) {
        const { data } = response;
        const { mint_requests } = data;
        const { transaction_id } = mint_requests[0];
        setNFTTransactionId(transaction_id);
      })
      .catch(function (error) {
        setToastMessage("Mint your NFT failed. Please try again.");
        handleOpenToast();
      });
    setTimeout(() => handleCloseToast(), 5000);
  };

  useEffect(() => {
    if (nftTransactionId) {
      function fetchNFTTransaction(attempt = 1) {
        if (attempt > 5) {
          // Set a maximum number of attempts to avoid infinite loops
          console.error("Maximum attempts reached. Stopping fetch.");
          return;
        }

        axios
          .get(
            `https://admin-api.phosphor.xyz/v1/transactions/${nftTransactionId}`,
            {
              headers: {
                "Phosphor-Api-Key": PHOSPHOR_API_KEY,
              },
            },
          )
          .then((response) => {
            if (
              response.data &&
              response.data["on_chain_status"] === "SUCCESS"
            ) {
              setToastType("success");
              setToastMessage("NFT transaction succeeded !");
              handleOpenToast();
              console.log("NFT transaction successful!");

              setIsMintLoading(false);
              setIsMembershipNFTMinted(true);
            } else {
              setToastType("info");
              handleOpenToast();
              setToastMessage("Minting NFT transaction...");
              console.log(
                `NFT transaction not successful yet. Attempt ${attempt}`,
              );
              setTimeout(() => fetchNFTTransaction(attempt + 1), 8000); // Retry after delay
            }
          })
          .catch((error) => {
            setToastType("error");
            setToastMessage("Fetching NFT transaction. Please try again.");
            handleOpenToast();
          });
      }

      // Start the initial fetch
      fetchNFTTransaction();
    }
  }, [nftTransactionId]);

  useEffect(() => {
    // isEthereumVerified && &&  isMembershipNFTMinted
    // if (isGithubVerified) {
    //   try {
    //     axios.post(`${API_ENDPOINT}/v1/user/level`, FETCH_CONFIG);
    //     axios
    //       .get(`${API_ENDPOINT}/level/1`, FETCH_CONFIG)
    //       .then((data) => console.log({ data }));
    //     setToastType("success");
    //     setToastMessage("GitHub verification succeeded !");
    //     handleOpenToast();
    //     setIsGithubVerified(true);
    //     setIsGithubVerifyOpen(false);
    //   } catch (err) {
    //     setToastType("error");
    //     setToastMessage("GitHub verification failed. Please try again.");
    //     handleOpenToast();
    //   }
    //   setTimeout(() => handleCloseToast(), 5000);
    //   // save to db http://f3ae-109-255-0-100.ngrok-free.app/v1/user/level
    //   // Show NFT as the poker card:
    //   // http://f3ae-109-255-0-100.ngrok-free.app/v1/level/1
    // }
  }, [isEthereumVerified, isGithubVerified, isMembershipNFTMinted]);

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
          {isMembershipNFTMinted ? (
            <img src={Check} className={styles.checkIcon} />
          ) : (
            <div className={styles.stepNumber}>3</div>
          )}
          <div className={styles.subtitle}>
            Join the Build for MetaMask program by making your membership NFT
          </div>
        </div>
        {!isMembershipNFTMinted && (
          <button
            className={`${styles.smallBtn} small-btn`}
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleMintNFT}
          >
            {isMintLoading ? "Loading..." : "Mint"}
          </button>
        )}
      </div>
      <div className={styles.divider} />
      {/*<div className={styles.finalWelldone}>*/}
      {/*  Well done, you just minted your first Build For MetaMask Membership NFT!*/}
      {/*</div>*/}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isToastOpen}
        autoHideDuration={3000}
        onClose={handleOpenToast}
        action={<img src={Close} onClick={handleCloseToast} />}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </form>
  );
}
