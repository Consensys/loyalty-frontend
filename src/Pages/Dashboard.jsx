import '../Styles/Dashboard.scss'

const Dashboard = () => {
  return (
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
          Mint Your Membership NFT
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
  )
}

export default Dashboard