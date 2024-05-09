import { useAccount } from 'wagmi'
import DashboardHero from '../Components/DashboardHero'
import Stamp from '../Components/Stamp'
import styles from '../Styles/Dashboard.module.scss'
import DashboardAccountInfo from '../Components/DashboardAccountInfo'
import PointsAndActivity from '../Components/PointsAndActivity'

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
        <div className={styles.cardWrap}>
        <Stamp
          points={10}
          title="Prover Ownership of Dapp Smart-Contract"
          subtitle="Prove that you own your Dapp Smart-Contract."
          buttonText='Verify ownership'
        />
        </div>
        <div className={styles.cardWrap}>
          <Stamp
            points={10}
            title="Verify Ownership of Dapp Domain"
            subtitle="Prove that your own your Dapp Domain URL."
            buttonText='Verify ownership'
          />
        </div>
        <div className={styles.cardWrap}>
          <Stamp
            points={10}
            title="Verify Smart-Contract Audit"
            subtitle="Prove that your Dapp smart-contract has been audited."
            buttonText='Submit proof'
          />
        </div>
        <div className={styles.cardWrap}>
          <Stamp
            points={10}
            title="Verify Integration of MetaMask SDK"
            subtitle="Submit proof of integration with the MetaMask SDK."
            buttonText='Submit proof'
          />
        </div>
      </div>
    </>
  )
}

export default Dashboard