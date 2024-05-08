import '../Styles/Stamp.scss';
import Solar from "../Images/Solar.svg";

function Stamp({ points, title, subtitle, buttonText }) {
  return (
    <div className="Stamp">
      <div className="first-row">
        <img src={Solar} />
        <div className='claim-points-wrapper'>
          <div className='claim-points-content'>+{points} XPs</div>
        </div>
      </div>
      <div className="title">{ title }</div>
      <div>{ subtitle }</div>
      <div className="button-wrapper">
        <button className="button-submit">
            <img src="/images/lock.png" />
            <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}

export default Stamp;
