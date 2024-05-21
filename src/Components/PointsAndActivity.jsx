import React from 'react';
import styles from '../Styles/PointsAndActivity.module.scss';
import RewardsPoints from './RewardsPoints';
import ActivityStats from './ActivityStats';

const PointsAndActivity = () => {
  return (
    <div className={styles.pointsAndActivity}>
      <div className={styles.rewardsWrap}>
        <RewardsPoints />
      </div>
      <div className={styles.activityWrap}>
        <ActivityStats />
      </div>
    </div>
  );
};

export default PointsAndActivity;