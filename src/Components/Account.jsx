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

  return (
    <div>
      {ensAvatar ? (
        <img alt="ENS Avatar" src={ensAvatar} />
      ) : (
        <div className={styles.accountWrap}>
          <Jazzicon address={address} onClick={disconnect} />
          {address && <div onClick={disconnect} className={styles.addressAbbr}>{ensName ? `${ensName} (${shortAddress})` : shortAddress}</div>}
        </div>
      )}
    </div>
  )
}