import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from '../Styles/RewardsPoints.module.scss';
import { useAccount } from 'wagmi';
import { FETCH_CONFIG } from '../constants';

const CLAIM_RPS_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/points/rps'
const RPS_URL = (userAddress) => `https://api.airtable.com/v0/app8TcmDxsrrZZJtw/tblqp1bjmMllXEAvu?filterByFormula={SmartContractAddress}=%27${userAddress}%27`
const ETHERSCAN_TXN_URL = 'https://sepolia.etherscan.io/tx/'
const ZAPIER_CLAIMED_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3jgb6y7?contractAddress={address}&amount={amount}'

const RewardsPoints = () => {
  let { isConnected, address } = useAccount()
  // address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  const [rps, setRPS] = useState(0)
  const [claiming, setClaiming] = useState(false)
  const [claimtxnhash, setClaimTxnHash] = useState(null)

  const getAvailableRPS = async () => {
    try {
      const { data } = await axios.get(RPS_URL(address), {
        headers: {
          "Authorization": `Bearer patBpvtowxhAUhXeA.ac023312f7f85803cc45d42d509c503ca73beba997d75dda3b39cf04073cc332`
        }
      })
      console.log(data)

      setRPS(data?.records[0]?.fields['Available Balance'] || 0)
    } catch (error) {
      console.error('avialble-rps-error:', error)
    }
  }

  const updateClaimedRPS = async () => {
    try {
      const { data } = await axios.get(ZAPIER_CLAIMED_URL.replace('{address}', address).replace('{amount}', rps))
      console.log(data)

      setRPS(data?.records[0]?.fields['Available Balance'] || 0)
    } catch (error) {
      console.error('avialble-rps-error:', error)
    }
  }

  const redeemRPSPoints = async () => {
    if (!isConnected || claiming) return

    try {
      setClaiming(true)
      const { data } = await axios.post(`${CLAIM_RPS_URL}/${address}/claim`, { rps: Number(rps) }, FETCH_CONFIG)
      console.log(data)
      if (data?.hash) setClaimTxnHash(data?.hash)
      await updateClaimedRPS()
      setRPS(0)
    } catch (error) {
      console.error('claim-error:', error)
    } finally {
      setClaiming(false)
    }
  }

  useEffect(() => {
    if (!isConnected) return

    getAvailableRPS()
  }, [isConnected])

  return (
    <div className={`${styles.rewardsPoints} Stamp`}>
      <div className={styles.availableArea}>
        <div className={`header ${styles.availableHeader}`}>
          <div className={'text'}>
            <img src="/images/trophy.svg" alt="Trophy" />
            Available Reward Points
          </div>
          {Number(rps) >= 1 ? 
            <a href='#' className={styles.cta} onClick={redeemRPSPoints} disabled={claiming}>
              {claiming ? 'Processing...' : 'Claim'}
            </a> : null
          }
          {Number(rps) < 1 && !!claimtxnhash && <a href={ETHERSCAN_TXN_URL + claimtxnhash} className={styles.cta} target='_blank' rel="noreferrer">
              View txn
            </a>}
        </div>
        <div className={`stat ${styles.stat}`}>
          <span className={'value'}>
            {rps}
          </span>
          <span className={'unit'}>
            RPS
          </span>
        </div>
      </div>
      <div className={styles.balanceArea}>
        <div className={`header ${styles.balanceHeader}`}>
          <img src="/images/trophy.svg" alt="Trophy" />
          Rewards Point Balance
        </div>
        <div className={`stat ${styles.stat}`}>
          <span className={'value'}>
            0
          </span>
          <span className={'unit'}>
            RPS
          </span>
        </div>
      </div>
    </div>
  );
};

export default RewardsPoints;