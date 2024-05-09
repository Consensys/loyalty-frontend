import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import Jazzicon from './Jazzicon'
import { shortenHexString } from '../utils'
import styles from '../Styles/Header.module.scss'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  const shortAddress = shortenHexString(address)

  const doDisconnect = () => {
    console.log('doDisconnect')
    disconnect()
  }

  return (
    <div>
      {ensAvatar ? (
        <img alt="ENS Avatar" src={ensAvatar} />
      ) : (
        <div className={styles.accountWrap}>
          <Jazzicon address={address} onClick={doDisconnect} />
          {address && <div onClick={doDisconnect} className={styles.addressAbbr}>{ensName ? `${ensName} (${shortAddress})` : shortAddress}</div>}
        </div>
      )}
    </div>
  )
}