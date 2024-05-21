import React from 'react';
import { useAccount } from 'wagmi'
import styles from '../Styles/AccountInfoCard.module.scss'
import { shortenHexString } from '../utils';

const AccountInfoCard = () => {
  const { address } = useAccount()
  // Your component logic goes here

  return (
    <div className={`${styles.accountInfoCard} Stamp`}>
      <h3>Uniswap</h3>
      <div className={styles.basicInfo}>
        <span>{shortenHexString(address)}</span>
        <span>https://myapp.eth</span>
      </div>
    </div>
  );
};

export default AccountInfoCard;