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
    </div>
  )
}

export default Dashboard