import React, { useEffect, useState } from 'react';
import styles from '../Styles/RewardsPoints.module.scss';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { useAccountStore } from '../store';
import { CircularProgress } from '@mui/material';

const START_REWARDS_POINTS_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3jse00x'
const POLL_REWARDS_POINTS_URL = 'https://api.airtable.com/v0/app8TcmDxsrrZZJtw/Buld%20For%20MetaMask'

const RewardsPoints = () => {
  const { address } = useAccount()
  const contractAddress = useAccountStore(state => state.contractAddress)
  const [pointsData, setPointsData] = useState({
    'Available Balance': 0,
    'Total Amount': 0
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const pollRewardsPoints = async () => {
    const { data: { records } } = await axios.get(POLL_REWARDS_POINTS_URL, {
      headers: {
        "Accept": "*/*",
        "Authorization": "Bearer patBpvtowxhAUhXeA.ac023312f7f85803cc45d42d509c503ca73beba997d75dda3b39cf04073cc332"
      }
    })
    const item = records.find(item => item.fields.SmartContractAddress === contractAddress)
    console.log('item', item)
    if (item) {
      return item.fields
    }
  }

  const fetchRewardsPoints = async () => {
    try {
      setIsProcessing(true)
      const { data: { status } } = await axios.get(START_REWARDS_POINTS_URL, {
        params: {
          address: contractAddress
        }
      })
      if (status !== 'success') {
        throw new Error('Failed to start fetching rewards points')
      }

      let interval
      return new Promise((resolve, reject) => {
        interval = setInterval(async () => {
          try {
            const data = await pollRewardsPoints(resolve, reject, interval)
            if (data) {
              setPointsData(data)
              resolve()
            }
          } catch (err) {
            console.error(err)
            reject()
          } finally {
            clearInterval(interval)
            setIsProcessing(false)
          }
        }, 2000)
      })
    } catch (err) {
      console.error(err)
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    fetchRewardsPoints()    
  }, [address, contractAddress])

  return (
    <div className={`${styles.rewardsPoints} Stamp`}>
      <div className={styles.availableArea}>
        <div className={`header ${styles.availableHeader}`}>
          <div className={'text'}>
            <img src="/images/trophy.svg" alt="Trophy" />
            Available Reward Points
          </div>
          <div className={styles.cta}>
            Claim
          </div>
        </div>
        <div className={`stat ${styles.stat}`}>
          {isProcessing ? (
            <CircularProgress />
          ) : (
            <>
              <span className={'value'}>
                {pointsData?.['Available Balance']}
              </span>
              <span className={'unit'}>
                RPS
              </span>            
            </>
          )}
        </div>
      </div>
      <div className={styles.balanceArea}>
        <div className={`header ${styles.balanceHeader}`}>
          <img src="/images/trophy.svg" alt="Trophy" />
          Rewards Point Balance
        </div>
        <div className={`stat ${styles.stat}`}>
          {isProcessing ? (
            <CircularProgress />
          ) : (
            <>
              <span className={'value'}>
                {pointsData?.['Total Amount']}
              </span>
              <span className={'unit'}>
                RPS
              </span>            
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsPoints;