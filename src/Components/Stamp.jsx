import styles from '../Styles/Stamp.module.scss';
import Solar from "../Images/Solar.svg";

function Stamp({ points, title, subtitle, buttonText, onClick }) {
  return (
    <div className={`Stamp ${styles.Stamp}`}>
      <div className={styles.firstRow}>
        <img src={Solar} />
        <div className={styles.claimPointsWrapper}>
          <div className={styles.claimPointsContent}>+{points} XPs</div>
        </div>
      </div>
      <div className={styles.title}>{title}</div>
      <div>{subtitle}</div>
      <div className={styles.buttonsWrapper}>
        <button onClick={onClick} className={styles.buttonSubmit}>
            <img src="/images/lock.png" />
            <span>{buttonText}</span>
        </button>
      </div>
    </div>
  )
}

export default Stamp;
