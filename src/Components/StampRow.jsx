import React from 'react';
import Stamp from './Stamp';
import styles from '../Styles/Dashboard.module.scss'

const StampRow = () => {
  // Your component logic here

  return (
    <>
        <div className={styles.cardWrap}>
        <Stamp
          points={10}
          title="Prover Ownership of Dapp Smart-Contract"
          subtitle="Prove that you own your Dapp Smart-Contract."
          buttonText='Verify ownership'
        />
        </div>
        <div className={styles.cardWrap}>
          <Stamp
            points={10}
            title="Verify Ownership of Dapp Domain"
            subtitle="Prove that your own your Dapp Domain URL."
            buttonText='Verify ownership'
          />
        </div>
        <div className={styles.cardWrap}>
          <Stamp
            points={10}
            title="Verify Smart-Contract Audit"
            subtitle="Prove that your Dapp smart-contract has been audited."
            buttonText='Submit proof'
          />
        </div>
        <div className={styles.cardWrap}>
          <Stamp
            points={10}
            title="Verify Integration of MetaMask SDK"
            subtitle="Submit proof of integration with the MetaMask SDK."
            buttonText='Submit proof'
          />
        </div>
    </>
  );
};

export default StampRow;