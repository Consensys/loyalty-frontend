import React from 'react';
import styles from '../Styles/RewardsPoints.module.scss';

const RewardsPoints = () => {
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
            500
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