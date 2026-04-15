import { useNetwork, useWallet } from '@txnlab/use-wallet-react'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getAccountExplorerUrl, getNetworkDisplayName } from '../utils/network/agentPassNetwork'

const Account = () => {
  const { activeAddress } = useWallet()
  const { activeNetwork } = useNetwork()

  return (
    <div className="account-summary">
      <a className="account-summary__link" target="_blank" rel="noreferrer" href={getAccountExplorerUrl(activeNetwork, activeAddress ?? '')}>
        <span className="account-summary__label">Address</span>
        <span className="account-summary__value">{ellipseAddress(activeAddress)}</span>
      </a>
      <div className="account-summary__network">
        <span className="account-summary__label">Network</span>
        <span className="account-summary__value">{getNetworkDisplayName(activeNetwork)}</span>
      </div>
    </div>
  )
}

export default Account
