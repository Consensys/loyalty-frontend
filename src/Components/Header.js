import './Header.css';
import Box from '@mui/material/Box';
import Jazzicon from "./Jazzicon";
import LogoText from '../Images/Logo-text.svg';
import Fox from '../Images/fox.png';

function shortenHexString(str) {
    return str.slice(0, 10) + "..." + str.slice(-6);
}

function Header() {
    const address = '0xc2326247DFf1e185874DC22CE7A26eFcF7FC39f3';
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
                <Jazzicon address={address} />
                <div className='address-abbr'>{shortenHexString(address)}</div>
            </Box>
        </Box>
    );
}

export default Header;
