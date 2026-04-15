import { useNetwork, useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import Account from './Account'
import { Button } from './ui/Button'
import { ModalShell } from './ui/ModalShell'
import { getNetworkDisplayName, isWalletSupportedOnNetwork } from '../utils/network/agentPassNetwork'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()
  const { activeNetwork } = useNetwork()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD
  const visibleWallets = wallets?.filter((wallet) => isWalletSupportedOnNetwork(wallet.id, activeNetwork)) ?? []

  const disconnectActiveWallet = async () => {
    if (wallets) {
      const activeWallet = wallets.find((wallet) => wallet.isActive)
      if (activeWallet) {
        await activeWallet.disconnect()
      } else {
        localStorage.removeItem('@txnlab/use-wallet:v4')
        localStorage.removeItem('@txnlab/use-wallet:v3')
        window.location.reload()
      }
    }
  }

  return (
    <ModalShell
      open={openModal}
      onClose={closeModal}
      eyebrow="Wallet access"
      title="Connect the right wallet for the right network"
      description={`Current network: ${getNetworkDisplayName(activeNetwork)}`}
      footer={
        <>
          <Button variant="ghost" onClick={closeModal}>
            Close
          </Button>
          {activeAddress && (
            <Button
              variant="danger"
              data-test-id="logout"
              onClick={async () => {
                await disconnectActiveWallet()
              }}
            >
              Disconnect
            </Button>
          )}
        </>
      }
    >
      {activeAddress ? (
        <div className="wallet-panel">
          <div className="wallet-panel__notice">
            <span className="wallet-panel__dot" />
            Wallet connected and ready for AgentPass actions.
          </div>
          <Account />
        </div>
      ) : (
        <div className="wallet-provider-list">
          {visibleWallets.map((wallet) => (
            <button
              type="button"
              data-test-id={`${wallet.id}-connect`}
              className="wallet-provider"
              key={`provider-${wallet.id}`}
              onClick={async () => {
                await wallet.connect()
                closeModal()
              }}
            >
              <div className="wallet-provider__brand">
                {!isKmd(wallet) && (
                  <img alt={`wallet_icon_${wallet.id}`} src={wallet.metadata.icon} className="wallet-provider__icon" />
                )}
                {isKmd(wallet) && <span className="wallet-provider__initials">LN</span>}
              </div>
              <div className="wallet-provider__copy">
                <span className="wallet-provider__title">{isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}</span>
                <span className="wallet-provider__hint">
                  {isKmd(wallet) ? 'Built-in KMD wallet for local development' : 'External wallet for TestNet interactions'}
                </span>
              </div>
              <span className="wallet-provider__arrow">↗</span>
            </button>
          ))}
        </div>
      )}
    </ModalShell>
  )
}
export default ConnectWallet
