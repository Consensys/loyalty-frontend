import './Header.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LogoText from '../Images/Logo-text.svg';
import Fox from '../Images/fox.png';
import { useAccount, useConnect } from 'wagmi';
import { Account } from './Account';

function Header() {
    const { isConnected } = useAccount() 
    const { connectors, connect } = useConnect()

    const connector = connectors[0]

    return (
        <Box className="Header"  display="flex">
            <Box width={'20%'} display="flex" alignItems="center">
                <img src={Fox} className="fox"/>
                <img src={LogoText} />
            </Box>
            <Box display="flex" justifyContent="space-around" width={'50%'}>
                <Box className="header-item" display="flex" alignItems="center" >
                    Dashboard
                </Box>
                <Box className="header-item" display="flex" alignItems="center" >
                    Activity
                </Box>
                <Box className="header-item" display="flex" alignItems="center" >
                    Earn
                </Box>
                <Box className="header-item" display="flex" alignItems="center" >
                    Redeem
                </Box>
                <Box className="header-item" display="flex" alignItems="center" >
                    Benefits
                </Box>
                <Box className="header-item" display="flex" alignItems="center" >
                    Support
                </Box>
            </Box>
            <Box display="flex" alignItems="center" flex={1} justifyContent="flex-end">
                {/* TODO: Pass in user address */}
                {isConnected ? (
                    <Account />
                ) : (
                    <Button
                        variant="contained"
                        onClick={() => connect({ connector })}
                    >Connect</Button>
                )}
            </Box>
        </Box>
    );
}

export default Header;
