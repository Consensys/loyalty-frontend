import styles from "../Styles/DashboardAccountInfo.module.scss";
import AccountInfoCard from "./AccountInfoCard";
import AccountProgressCard from "./AccountProgressCard";

const DashboardAccountInfo = () => {
  return (
    <div className={styles.dashboardAccountOverview}>
      <h2>Overview</h2>
      <div className={styles.cardsArea}>
        <div className={styles.accountInfo}>
          <AccountInfoCard />
        </div>
        <div className={styles.accountProgress}>
          <AccountProgressCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardAccountInfo;
