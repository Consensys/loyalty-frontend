import styles from "../Styles/Header.module.scss"
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

  console.log('useAccount()', useAccount())

  const connector = connectors[0]

  return (
    <Box className={styles.Header} display="flex" style={{ backgroundColor: "#24272A" }}>
      <Box width={"20%"} display="flex" alignItems="center">
        <img src={Fox} className={styles.fox} />
        <img src={LogoText} />
      </Box>
      <Box display="flex" justifyContent="space-around" width={"50%"}>
        <Box className={styles.headerItem} display="flex" alignItems="center">
          <Link to="/">Dashboard</Link>
        </Box>
        <Box className={styles.headerItem} display="flex" alignItems="center">
          <Link to="/activity">Activity</Link>
        </Box>
        <Box className={styles.headerItem} display="flex" alignItems="center">
          <Link to="/auditor">Auditor</Link>
        </Box>
        <Box className={styles.headerItem} display="flex" alignItems="center">
          <Link to="/earn">Earn</Link>
        </Box>
        <Box className={styles.headerItem} display="flex" alignItems="center">
          <Link to="/redeem">Redeem</Link>
        </Box>
        <Box className={styles.headerItem} display="flex" alignItems="center">
          <Link to="/benefits">Benefits</Link>
        </Box>
        <Box className={styles.headerItem} display="flex" alignItems="center">
          <Link to="/support">Support</Link>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" flex={1} justifyContent="flex-end">
        {isConnected && <Account/>}
      </Box>
    </Box>
  )
}

export default Header
