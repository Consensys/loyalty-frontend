import './Stamp.css';
import Solar from "../Images/Solar.svg";

function Stamp({ points, title, subtitle }) {
    return (
        <div className="Stamp">
            <div className="first-row">
                <img src={Solar} />
                <div className='claim-points-wrapper'>
                    <div className='claim-points-content'>Claim {points} points</div>
                </div>
            </div>
            <div className="title">{ title }</div>
            <div>{ subtitle }</div>
            <div className="button-wrapper">
                <button className="button-submit">Submit proof</button>
            </div>
        </div>
    );
}

export default Stamp;
