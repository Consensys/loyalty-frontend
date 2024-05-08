import Stamp from '../Components/Stamp'
import '../Styles/Dashboard.scss'

const Dashboard = () => {
  return (
    <>
      <div className="hero" >
        <div className="info">
          <h2>Start by Proving You're a Web3 Builder</h2>
          <h3>Prove your identity to Mint your membership NFT</h3>
          <ul>
            <p><span className="number">1</span>Connect to GitHub to verify your code contributions</p>
            <p><span className="number">2</span>Verify activity on Ethereum or Linea</p>
            <p><span className="number">3</span>Mint your membership NFT.</p>
          </ul>
          <button className='button' onClick={null}>
          Join the Build for MetaMask Program Now!
          </button>
        </div>
        <div className="cards">
          <img src="/images/card-1.png"
            style={{ zIndex: 101, left: 270, position: 'relative' }}
          />
          <img src="/images/card-2.png"
            style={{ zIndex: 102, left: 180, position: 'relative' }}
          />
          <img src="/images/card-3.png"
            style={{ zIndex: 103, left: 90, position: 'relative' }}
          />
          <img src="/images/card-4.png"
            style={{ zIndex: 104, position: 'relative' }}
          />
        </div>
      </div>
      <div className="mid-text">
        <h2>Collect Achievement Stamps to gain XPs and Level Up</h2>
        <p>Prove compliance with different achievement criteria of the program to gain XPs and level up,<br />unlocking new opportunities and benefits as you advance.</p>
      </div>
      <div className="card-row">
        <div className="card-wrap">
        <Stamp
          points={10}
          title="Prover Ownership of Dapp Smart-Contract"
          subtitle="Prove that you own your Dapp Smart-Contract."
          buttonText='Verify ownership'
        />
        </div>
        <div className="card-wrap">
          <Stamp
            points={10}
            title="Verify Ownership of Dapp Domain"
            subtitle="Prove that your own your Dapp Domain URL."
            buttonText='Verify ownership'
          />
        </div>
        <div className="card-wrap">
          <Stamp
            points={10}
            title="Verify Smart-Contract Audit"
            subtitle="Prove that your Dapp smart-contract has been audited."
            buttonText='Submit proof'
          />
        </div>
        <div className="card-wrap">
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