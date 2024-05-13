import { Drawer } from "@mui/material";
import styles from "../Styles/Dashboard.module.scss";
import React, { useState } from "react";
import Web3BuilderVerification from "./Web3BuilderVerification";
import { useAccount, useConnect } from "wagmi";
import CubesCollection from "../Images/cubes-collection.png";

export const DashboardHero = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const connector = connectors[0];

  // TODO: Show Drawer when not connected
  const onClickJoin = () => {
    if (!isConnected) {
      connect({ connector })
    } else {
      setIsModalVisible(true);
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.info}>
        <h2>Start by Proving You're a Web3 Builder</h2>
        <h3>Prove your identity to Mint your membership NFT</h3>
        <ul>
          <p>
            <span className={styles.number}>1</span>Connect to GitHub to verify
            your code contributions
          </p>
          <p>
            <span className={styles.number}>2</span>Verify activity on Ethereum
            or Linea
          </p>
          <p>
            <span className={styles.number}>3</span>Mint your membership NFT.
          </p>
        </ul>
        <button className={styles.button} onClick={onClickJoin}>
          Join the Build for MetaMask Program Now!
        </button>
      </div>
      <div className={styles.cards}>
        <img
          src="/images/card-1.png"
          style={{ zIndex: 101, left: 270, position: "relative" }}
        />
        <img
          src="/images/card-2.png"
          style={{ zIndex: 102, left: 180, position: "relative" }}
        />
        <img
          src="/images/card-3.png"
          style={{ zIndex: 103, left: 90, position: "relative" }}
        />
        <img
          src="/images/card-4.png"
          style={{ zIndex: 104, position: "relative" }}
        />
      </div>
      <Drawer
        anchor="right"
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        ModalProps={{ classes: "modal" }}
        PaperProps={{
          sx: {
            width: 436,
            background: "#24272a",
          },
        }}
      >
        <Web3BuilderVerification setIsVisible={setIsModalVisible} />
        <img src={CubesCollection} className={styles.cubesCollection} />
      </Drawer>
    </div>
  );
};

export default DashboardHero;
