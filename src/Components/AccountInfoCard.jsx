import React from 'react';
import { useAccount } from 'wagmi'
import '../Styles/AccountInfoCard.scss'
import { shortenHexString } from '../utils';

const AccountInfoCard = () => {
  const { address } = useAccount()
  // Your component logic goes here

  return (
    <div className="account-info-card Stamp">
      <h3>Uniswap</h3>
      <div className="basic-info">
        <span>{shortenHexString(address)}</span>
        <span>https://myapp.eth</span>
      </div>
    </div>
  );
};

export default AccountInfoCard;