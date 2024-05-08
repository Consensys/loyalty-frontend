import "../Styles/Header.css"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import LogoText from "../Images/Logo-text.svg"
import Fox from "../Images/fox.png"
import { useAccount, useConnect } from "wagmi"
import { Account } from "./Account"
import { Link } from "react-router-dom"

function Header() {
  const { isConnected } = useAccount()
  const { connectors, connect } = useConnect()

  const connector = connectors[0]

  return (
    <Box className="Header" display="flex" style={{ backgroundColor: "#24272A" }}>
      <Box width={"20%"} display="flex" alignItems="center">
        <img src={Fox} className="fox" />
        <img src={LogoText} />
      </Box>
      <Box display="flex" justifyContent="space-around" width={"50%"}>
        <Box className="header-item" display="flex" alignItems="center">
          <Link to="/">Dashboard</Link>
        </Box>
        <Box className="header-item" display="flex" alignItems="center">
          <Link to="/activity">Activity</Link>
        </Box>
        <Box className="header-item" display="flex" alignItems="center">
          <Link to="/auditor">Auditor</Link>
        </Box>
        <Box className="header-item" display="flex" alignItems="center">
          <Link to="/earn">Earn</Link>
        </Box>
        <Box className="header-item" display="flex" alignItems="center">
          <Link to="/redeem">Redeem</Link>
        </Box>
        <Box className="header-item" display="flex" alignItems="center">
          <Link to="/benefits">Benefits</Link>
        </Box>
        <Box className="header-item" display="flex" alignItems="center">
          <Link to="/support">Support</Link>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" flex={1} justifyContent="flex-end">
        {/* TODO: Pass in user address */}
        {isConnected ? (
          <Account />
        ) : (
          <Button variant="contained" onClick={() => connect({ connector })}>
            Connect
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Header