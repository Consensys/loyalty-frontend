import React from 'react';
import styles from '../Styles/ActivityStats.module.scss';

const ActivityStats = () => {
  return (
    <div className={`Stamp ${styles.activityStats}`}>
      <div className={styles.activityArea}>
        <div className={`header ${styles.statsHeader}`}>
          <div className={'text'}>
            <img src="/images/list.svg" alt="Trophy" />
            Last Week Activity
          </div>
          <div className={styles.cta}>
            View all activity
          </div>
        </div>
      </div>
        <div className={styles.statsArea}>
          <div className={`stat ${styles.stat}`}>
            <span className={'value'}>
              +200
            </span>
            <span className={'unit'}>
              RPS
            </span>
          </div>
          <div className={`stat ${styles.stat}`}>
            <span className={'value'}>
              +5
            </span>
            <span className={'unit'}>
              Stamps
            </span>
          </div>
          <div className={`stat ${styles.stat}`}>
            <span className={'value'}>
              +20
            </span>
            <span className={'unit'}>
              XP
            </span>
          </div>          
        </div>    
    </div>
  );
};

export default ActivityStats;