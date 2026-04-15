import { NetworkId, useNetwork, useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import GrantConsentModal from './components/GrantConsentModal'
import RegisterAgentModal from './components/RegisterAgentModal'
import VerifyConsentModal from './components/VerifyConsentModal'
import { Button } from './components/ui/Button'
import { Dropdown } from './components/ui/Dropdown'
import { getCachedAgentPassAppId, resetAgentPassApp } from './hooks/useAgentPassClient'
import { ellipseAddress } from './utils/ellipseAddress'
import { AgentPassNetworkId, getEnabledAgentPassNetworks, getNetworkDisplayName, resolveAgentPassNetwork } from './utils/network/agentPassNetwork'

const demoActions = [
  {
    step: '01',
    title: 'Register agent identity',
    description: 'Create a verifiable on-chain identity that binds an agent to the connected owner wallet.',
    accentClass: 'accent-pink',
  },
  {
    step: '02',
    title: 'Grant scoped consent',
    description: 'Limit access with a scope like profile.read and a time-bound expiry window.',
    accentClass: 'accent-cyan',
  },
  {
    step: '03',
    title: 'Verify or revoke',
    description: 'Show the service-side trust check and prove that permissions can be revoked at any time.',
    accentClass: 'accent-yellow',
  },
]

const trustLoop = [
  ['Identity', 'Who is the agent acting on behalf of the user?'],
  ['Consent', 'What exact scope was granted by the user?'],
  ['Verification', 'Can the service machine-check permission before serving data?'],
  ['Revocation', 'Can the user withdraw consent without hidden state?'],
]

const requireWalletMessage = 'Connect a wallet first to try the AgentPass flow.'

const Home = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openRegisterModal, setOpenRegisterModal] = useState(false)
  const [openGrantModal, setOpenGrantModal] = useState(false)
  const [openVerifyModal, setOpenVerifyModal] = useState(false)
  const [switchingNetwork, setSwitchingNetwork] = useState<AgentPassNetworkId | null>(null)
  const { activeAddress, activeWallet } = useWallet()
  const { activeNetwork, setActiveNetwork } = useNetwork()
  const { enqueueSnackbar } = useSnackbar()

  const networkOptions = getEnabledAgentPassNetworks().map((network) => ({
    value: network,
    label: getNetworkDisplayName(network),
    hint: network === NetworkId.LOCALNET ? 'KMD' : 'Pera / Defly',
    icon: <span className={`network-chip ${network === NetworkId.LOCALNET ? 'network-chip--local' : 'network-chip--test'}`}>{network === NetworkId.LOCALNET ? 'LN' : 'TN'}</span>,
  }))

  const currentNetwork = resolveAgentPassNetwork(activeNetwork)
  const cachedAppId = getCachedAgentPassAppId(currentNetwork)

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

  const withWallet = (action: () => void) => {
    if (!activeAddress) {
      enqueueSnackbar(requireWalletMessage, { variant: 'info' })
      setOpenWalletModal(true)
      return
    }

    action()
  }

  return (
    <div className="app-shell">
      <div className="page-wrap">
        <header className="site-nav neo-card">
          <div className="site-brand">
            <div className="site-brand__badge">AP</div>
            <div>
              <p className="site-brand__kicker">Agent identity + consent</p>
              <h1 className="site-brand__title">AgentPass</h1>
            </div>
          </div>

          <div className="site-nav__controls">
            <div className="site-nav__network">
              <span className="site-nav__label">Network</span>
              <Dropdown
                options={networkOptions}
                value={currentNetwork}
                disabled={switchingNetwork !== null || networkOptions.length <= 1}
                onChange={(value) => {
                  void handleNetworkSwitch(resolveAgentPassNetwork(value))
                }}
              />
            </div>
            <Button variant={activeAddress ? 'secondary' : 'primary'} onClick={() => setOpenWalletModal(true)}>
              {activeAddress ? `Connected: ${ellipseAddress(activeAddress)}` : `Connect ${getNetworkDisplayName(currentNetwork)} wallet`}
            </Button>
          </div>
        </header>

        <main className="page-content">
          <section className="hero-grid">
            <div className="hero-copy">
              <p className="section-kicker">Trust layer for AI agents</p>
              <h2 className="hero-title">
                Give agents an
                <span className="hero-title__highlight"> identity, scope, and stop button</span>
              </h2>
              <p className="hero-description">
                AgentPass helps services answer the hard questions before an AI agent acts: who this agent is, whether the user actually
                authorized it, and whether that permission can be revoked.
              </p>

              <div className="hero-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    withWallet(() => setOpenRegisterModal(true))
                  }}
                >
                  Start demo
                </Button>
                <Button variant="ghost" size="lg" onClick={() => setOpenWalletModal(true)}>
                  {activeAddress ? 'Manage wallet' : 'Connect wallet'}
                </Button>
              </div>

              <div className="hero-pills">
                <span className="hero-pill accent-pink">Agent identity</span>
                <span className="hero-pill accent-cyan">Scoped consent</span>
                <span className="hero-pill accent-yellow">Service verification</span>
                <span className="hero-pill accent-purple">Revocation</span>
              </div>
            </div>

            <aside className="hero-status neo-card">
              <div className="hero-status__header">
                <p className="section-kicker">Live status</p>
                <span className="status-dot" />
              </div>
              <div className="status-list">
                <div className="status-row">
                  <span className="status-row__label">Selected network</span>
                  <span className="status-row__value">{getNetworkDisplayName(currentNetwork)}</span>
                </div>
                <div className="status-row">
                  <span className="status-row__label">Wallet state</span>
                  <span className="status-row__value">{activeAddress ? 'Connected' : 'Not connected'}</span>
                </div>
                <div className="status-row">
                  <span className="status-row__label">Cached app ID</span>
                  <span className="status-row__value">{cachedAppId ?? 'Not deployed yet'}</span>
                </div>
              </div>

              <div className="demo-checklist">
                <p className="demo-checklist__title">Demo script</p>
                <ol>
                  <li>Connect wallet</li>
                  <li>Register agent</li>
                  <li>Grant consent</li>
                  <li>Verify or revoke</li>
                </ol>
              </div>

              <Button
                variant="accent"
                fullWidth
                onClick={() => {
                  resetAgentPassApp(currentNetwork)
                  enqueueSnackbar(`Cleared the cached ${getNetworkDisplayName(currentNetwork)} app ID. Next action will redeploy.`, {
                    variant: 'info',
                  })
                }}
              >
                Reset cached {getNetworkDisplayName(currentNetwork)} app
              </Button>
            </aside>
          </section>

          <section className="section-block">
            <div className="section-heading">
              <p className="section-kicker">What this MVP proves</p>
              <h3 className="section-title">The core trust loop for agentic commerce</h3>
            </div>
            <div className="trust-loop">
              {trustLoop.map(([title, copy], index) => (
                <div key={title} className="trust-card neo-card">
                  <div className="trust-card__index">0{index + 1}</div>
                  <h4 className="trust-card__title">{title}</h4>
                  <p className="trust-card__copy">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section-block">
            <div className="section-heading">
              <p className="section-kicker">Run the flow</p>
              <h3 className="section-title">Use the same UI for LocalNet or TestNet demos</h3>
            </div>
            <div className="action-grid">
              {demoActions.map((action) => (
                <article key={action.step} className="action-card neo-card">
                  <div className={`action-card__step ${action.accentClass}`}>{action.step}</div>
                  <h4 className="action-card__title">{action.title}</h4>
                  <p className="action-card__copy">{action.description}</p>
                  {action.step === '01' && (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        withWallet(() => setOpenRegisterModal(true))
                      }}
                    >
                      Open registration
                    </Button>
                  )}
                  {action.step === '02' && (
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => {
                        withWallet(() => setOpenGrantModal(true))
                      }}
                    >
                      Open consent grant
                    </Button>
                  )}
                  {action.step === '03' && (
                    <Button
                      variant="accent"
                      fullWidth
                      onClick={() => {
                        withWallet(() => setOpenVerifyModal(true))
                      }}
                    >
                      Open verification
                    </Button>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="section-block">
            <div className="story-grid">
              <div className="story-panel story-panel--dark">
                <p className="section-kicker section-kicker--light">User perspective</p>
                <h3 className="story-panel__title">I decide what my agent can do</h3>
                <p className="story-panel__copy">
                  The user registers an agent, grants a narrow scope like <code>profile.read</code>, and can revoke it later without
                  relying on hidden settings or off-chain promises.
                </p>
              </div>
              <div className="story-panel neo-card">
                <p className="section-kicker">Service perspective</p>
                <h3 className="story-panel__title">I can verify before I trust</h3>
                <p className="story-panel__copy">
                  A service can verify agent identity and user-approved consent before returning protected data. The current MVP gives you
                  the authorization primitive that later payments and compliance layers can build on.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <RegisterAgentModal openModal={openRegisterModal} setModalState={setOpenRegisterModal} />
      <GrantConsentModal openModal={openGrantModal} setModalState={setOpenGrantModal} />
      <VerifyConsentModal openModal={openVerifyModal} setModalState={setOpenVerifyModal} />
    </div>
  )
}

export default Home
