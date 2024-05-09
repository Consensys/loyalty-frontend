import { useAccount } from 'wagmi'
import DashboardHero from '../Components/DashboardHero'
import styles from '../Styles/Dashboard.module.scss'
import DashboardAccountInfo from '../Components/DashboardAccountInfo'
import PointsAndActivity from '../Components/PointsAndActivity'
import StampRow from '../Components/StampRow'

const Dashboard = () => {
  const { isConnected } = useAccount()

  console.log('useAccount()', useAccount())
  return (
    <>
      {isConnected ? (
        <div className={styles.accountArea}>
          <DashboardAccountInfo />
          <PointsAndActivity />
        </div>
      ) : (
        <DashboardHero />
      )}
      <div className={styles.midText}>
        <h2>Collect Achievement Stamps to gain XPs and Level Up</h2>
        <p>Prove compliance with different achievement criteria of the program to gain XPs and level up,<br />unlocking new opportunities and benefits as you advance.</p>
      </div>
      <div className={styles.cardRow}>
        <StampRow />
      </div>
    </>
  )
}

export default Dashboard