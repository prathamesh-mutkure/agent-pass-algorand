import { WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { SnackbarProvider } from 'notistack'
import Home from './Home'
import { getDefaultAgentPassNetwork, getSupportedWallets, getWalletManagerNetworks } from './utils/network/agentPassNetwork'

const walletManager = new WalletManager({
  wallets: getSupportedWallets(),
  defaultNetwork: getDefaultAgentPassNetwork(),
  networks: getWalletManagerNetworks(),
  options: {
    resetNetwork: true,
  },
})

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider manager={walletManager}>
        <Home />
      </WalletProvider>
    </SnackbarProvider>
  )
}
