import React, { useEffect } from 'react';
import styles from '../Styles/AccountProgressCard.module.scss'
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { useAccount } from 'wagmi';
import { shortenHexString } from '../utils';
import axios from 'axios'
import { FETCH_CONFIG } from '../constants';

const LEVEL_URL = 'https://f3ae-109-255-0-100.ngrok-free.app/v1/user/level'

const JoinButton = () => {
  return (
    <div className={`${styles.accountProgressCard} Stamp`}>
      <button className={styles.button}>
        Join the Build for MetaMask Program Now!
      </button>
    </div>
  );
}

const AccountProgressCard = () => {
  const { address } = useAccount()

  const fetchLevel = () => {
    try {
      const { data } = axios.get(`${LEVEL_URL}/${address}`, FETCH_CONFIG)
      console.log('data: ', data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchLevel()
  } ,[])

  return (
    <div className={`${styles.accountProgressCard} Stamp`}>
      <div className={styles.currentLevel}>
        <img src="/images/card-1.png" alt="card" className={styles.card} />
        <div className={styles.levelInfo}>
          <div className={styles.title}>
            <img src="/images/check.svg" alt="check" />
            Current Level
          </div>
          <div className={styles.labels}>
            <h3>Explorer</h3>
            10 / 20 XP
          </div>
          <div className={styles.progressBar}>
          <BorderLinearProgress variant="determinate" value={50} />
          </div>
          <div className={styles.address}>
            {shortenHexString(address)}
          </div>
        </div>
      </div>
      <div className={styles.nextLevel}>
        <div className={styles.top}>
          <span className={styles.title}>
            <img src="/images/lock.svg" />Next Level
          </span>
          <span className={styles.unlockText}>
            <a href="#">How do I unlock?</a>
          </span>
        </div>
        <div className={styles.levelLabel}>
          <h3>Silver</h3>
        </div>
      </div>
    </div>
  );
};


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export default AccountProgressCard;