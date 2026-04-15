// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import GrantConsentModal from './components/GrantConsentModal'
import RegisterAgentModal from './components/RegisterAgentModal'
import VerifyConsentModal from './components/VerifyConsentModal'
import { resetAgentPassApp } from './hooks/useAgentPassClient'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openRegisterModal, setOpenRegisterModal] = useState<boolean>(false)
  const [openGrantModal, setOpenGrantModal] = useState<boolean>(false)
  const [openVerifyModal, setOpenVerifyModal] = useState<boolean>(false)
  const { activeAddress } = useWallet()

  return (
    <div className="hero min-h-screen bg-teal-400">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
        <div className="max-w-md">
          <h1 className="text-4xl">
            <div className="font-bold">AgentPass</div>
          </h1>
          <p className="py-4 text-sm">Decentralized identity & consent for AI agents on Algorand.</p>

          <div className="grid">
            <button data-test-id="connect-wallet" className="btn m-2" onClick={() => setOpenWalletModal(true)}>
              {activeAddress ? 'Wallet Connected' : 'Connect Wallet'}
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
                    resetAgentPassApp()
                    alert('Cached AgentPass app ID cleared. Next action will redeploy.')
                  }}
                >
                  Reset deployed app (dev)
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
