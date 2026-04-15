// src/components/Home.tsx
import { NetworkId, useNetwork, useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import GrantConsentModal from './components/GrantConsentModal'
import RegisterAgentModal from './components/RegisterAgentModal'
import VerifyConsentModal from './components/VerifyConsentModal'
import { resetAgentPassApp } from './hooks/useAgentPassClient'
import { AgentPassNetworkId, getNetworkDisplayName, resolveAgentPassNetwork } from './utils/network/agentPassNetwork'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openRegisterModal, setOpenRegisterModal] = useState<boolean>(false)
  const [openGrantModal, setOpenGrantModal] = useState<boolean>(false)
  const [openVerifyModal, setOpenVerifyModal] = useState<boolean>(false)
  const [switchingNetwork, setSwitchingNetwork] = useState<AgentPassNetworkId | null>(null)
  const { activeAddress, activeWallet } = useWallet()
  const { activeNetwork, setActiveNetwork } = useNetwork()
  const { enqueueSnackbar } = useSnackbar()

  const currentNetwork = resolveAgentPassNetwork(activeNetwork)

  const handleNetworkSwitch = async (targetNetwork: AgentPassNetworkId) => {
    if (targetNetwork === currentNetwork) {
      return
    }

    setSwitchingNetwork(targetNetwork)

    try {
      if (activeWallet) {
        await activeWallet.disconnect()
      }

      await setActiveNetwork(targetNetwork)
      enqueueSnackbar(`Switched to ${getNetworkDisplayName(targetNetwork)}. Connect a wallet for that network to continue.`, {
        variant: 'info',
      })
    } catch (error: unknown) {
      enqueueSnackbar(`Error: ${(error as Error).message}`, { variant: 'error' })
    } finally {
      setSwitchingNetwork(null)
    }
  }

  return (
    <div className="hero min-h-screen bg-teal-400">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
        <div className="max-w-md">
          <h1 className="text-4xl">
            <div className="font-bold">AgentPass</div>
          </h1>
          <p className="py-4 text-sm">Decentralized identity & consent for AI agents on Algorand.</p>
          <div className="flex flex-wrap justify-center gap-2 pb-4">
            <button
              type="button"
              data-test-id="switch-localnet"
              className={`btn btn-sm ${currentNetwork === NetworkId.LOCALNET ? 'btn-secondary' : 'btn-outline'}`}
              disabled={switchingNetwork !== null}
              onClick={() => void handleNetworkSwitch(NetworkId.LOCALNET)}
            >
              {switchingNetwork === NetworkId.LOCALNET ? <span className="loading loading-spinner loading-xs" /> : 'LocalNet'}
            </button>
            <button
              type="button"
              data-test-id="switch-testnet"
              className={`btn btn-sm ${currentNetwork === NetworkId.TESTNET ? 'btn-secondary' : 'btn-outline'}`}
              disabled={switchingNetwork !== null}
              onClick={() => void handleNetworkSwitch(NetworkId.TESTNET)}
            >
              {switchingNetwork === NetworkId.TESTNET ? <span className="loading loading-spinner loading-xs" /> : 'TestNet'}
            </button>
          </div>
          <p className="pb-2 text-xs opacity-70">
            Active network: <span className="font-semibold">{getNetworkDisplayName(currentNetwork)}</span>
          </p>

          <div className="grid">
            <button data-test-id="connect-wallet" className="btn m-2" onClick={() => setOpenWalletModal(true)}>
              {activeAddress ? `${getNetworkDisplayName(currentNetwork)} Wallet Connected` : `Connect ${getNetworkDisplayName(currentNetwork)} Wallet`}
            </button>

            {activeAddress && (
              <>
                <button data-test-id="register-agent" className="btn btn-primary m-2" onClick={() => setOpenRegisterModal(true)}>
                  Register Agent
                </button>
                <button data-test-id="grant-consent" className="btn btn-primary m-2" onClick={() => setOpenGrantModal(true)}>
                  Grant Consent
                </button>
                <button data-test-id="verify-consent" className="btn btn-primary m-2" onClick={() => setOpenVerifyModal(true)}>
                  Verify Consent
                </button>
                <button
                  data-test-id="reset-app"
                  className="btn btn-ghost btn-xs m-2"
                  onClick={() => {
                    resetAgentPassApp(currentNetwork)
                    enqueueSnackbar(`Cleared the cached ${getNetworkDisplayName(currentNetwork)} app ID. Next action will redeploy.`, {
                      variant: 'info',
                    })
                  }}
                >
                  Reset deployed app ({getNetworkDisplayName(currentNetwork)})
                </button>
              </>
            )}
          </div>

          <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
          <RegisterAgentModal openModal={openRegisterModal} setModalState={setOpenRegisterModal} />
          <GrantConsentModal openModal={openGrantModal} setModalState={setOpenGrantModal} />
          <VerifyConsentModal openModal={openVerifyModal} setModalState={setOpenVerifyModal} />
        </div>
      </div>
    </div>
  )
}

export default Home
