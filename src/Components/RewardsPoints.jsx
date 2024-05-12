import React, { useEffect, useState } from 'react';
import styles from '../Styles/RewardsPoints.module.scss';
import axios from 'axios';

const START_REWARDS_POINTS_URL = 'https://hooks.zapier.com/hooks/catch/9914807/3jse00x'
const POLL_REWARDS_POINTS_URL = 'https://api.airtable.com/v0/app8TcmDxsrrZZJtw/Buld%20For%20MetaMask'
const VERIFIED_CONTRACT_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

const RewardsPoints = () => {
  const [pointsData, setPointsData] = useState(null)

  const pollRewardsPoints = async (resolve, reject) => {
    const { data: { records } } = await axios.get(POLL_REWARDS_POINTS_URL, {
      headers: {
        "Accept": "*/*",
        "Authorization": "Bearer patBpvtowxhAUhXeA.ac023312f7f85803cc45d42d509c503ca73beba997d75dda3b39cf04073cc332"
      }
    })
    const { fields } = records.find(item => item.fields['SmartContractAddress'] === VERIFIED_CONTRACT_ADDRESS)
    if (fields) {
      setPointsData(fields)
      resolve()
    }
  }

  const fetchRewardsPoints = async () => {
    try {
      const { data: { status } } = await axios.get(START_REWARDS_POINTS_URL, {
        params: {
          address: VERIFIED_CONTRACT_ADDRESS
        }
      })
      if (status !== 'success') {
        throw new Error('Failed to start fetching rewards points')
      }
      return new Promise((resolve, reject) => {
        let interval = setInterval(async () => {
          try {
            await pollRewardsPoints(resolve, reject)
          } catch (err) {
            console.error(err)
            clearInterval(interval)
            reject()
          }
        }, 2000)
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchRewardsPoints()    
  }, [])

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
          <span className={'value'}>
            {pointsData?.['Available Balance'] || 0}
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
            {pointsData?.['Total Amount'] || 0}
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