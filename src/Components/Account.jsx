import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import Jazzicon from './Jazzicon'

function shortenHexString(str) {
  return str.slice(0, 10) + "..." + str.slice(-6);
}

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
        <div className="account-wrap">
          <Jazzicon address={address} onClick={disconnect} />
          {address && <div onClick={disconnect} className='address-abbr'>{ensName ? `${ensName} (${shortAddress})` : shortAddress}</div>}
        </div>
      )}
    </div>
  )
}