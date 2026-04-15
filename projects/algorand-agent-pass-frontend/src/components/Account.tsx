import { useNetwork, useWallet } from '@txnlab/use-wallet-react'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getAccountExplorerUrl, getNetworkDisplayName } from '../utils/network/agentPassNetwork'

const Account = () => {
  const { activeAddress } = useWallet()
  const { activeNetwork } = useNetwork()

  return (
    <div>
      <a className="text-xl" target="_blank" rel="noreferrer" href={getAccountExplorerUrl(activeNetwork, activeAddress ?? '')}>
        Address: {ellipseAddress(activeAddress)}
      </a>
      <div className="text-xl">Network: {getNetworkDisplayName(activeNetwork)}</div>
    </div>
  )
}

export default Account
