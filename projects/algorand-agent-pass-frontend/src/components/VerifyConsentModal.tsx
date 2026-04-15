import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAgentPassClient } from '../hooks/useAgentPassClient'
import { Button } from './ui/Button'
import { ModalShell } from './ui/ModalShell'

interface VerifyConsentModalProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const VerifyConsentModal = ({ openModal, setModalState }: VerifyConsentModalProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [revoking, setRevoking] = useState<boolean>(false)
  const [agentId, setAgentId] = useState<string>('')
  const [scope, setScope] = useState<string>('profile.read')
  const [result, setResult] = useState<boolean | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const { getClient } = useAgentPassClient()

  const verify = async () => {
    setLoading(true)
    setResult(null)
    try {
      const client = await getClient()
      const res = await client.send.verifyConsent({
        args: { agentId: BigInt(agentId), scope },
      })
      setResult(res.return ?? false)
    } catch (e: unknown) {
      enqueueSnackbar(`Error: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const revoke = async () => {
    setRevoking(true)
    try {
      const client = await getClient()
      await client.send.revokeConsent({
        args: { agentId: BigInt(agentId), scope },
      })
      enqueueSnackbar(`Consent revoked`, { variant: 'success' })
      setResult(null)
    } catch (e: unknown) {
      enqueueSnackbar(`Error: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setRevoking(false)
    }
  }

  const close = () => {
    setResult(null)
    setModalState(false)
  }

  return (
    <ModalShell
      open={openModal}
      onClose={close}
      eyebrow="Step 3"
      title="Verify or revoke consent"
      description="Simulate the service-side permission check. Verify access for a scope, then revoke it if needed."
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Close
          </Button>
          {result === true && (
            <Button variant="danger" onClick={revoke} disabled={revoking}>
              {revoking ? 'Revoking...' : 'Revoke'}
            </Button>
          )}
          <Button variant="accent" onClick={verify} disabled={!agentId || !scope || loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </>
      }
    >
      <div className="form-grid">
        <label className="field">
          <span className="field__label">Agent ID</span>
          <input
            type="number"
            placeholder="1"
            className="field__input"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field__label">Scope</span>
          <input
            type="text"
            placeholder="profile.read"
            className="field__input"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          />
        </label>
      </div>
      {result !== null && (
        <div className={`status-banner ${result ? 'status-banner--success' : 'status-banner--error'}`}>
          <span className="status-banner__title">{result ? 'Consent is valid' : 'Consent is not valid'}</span>
          <span className="status-banner__copy">
            {result ? 'The service can safely continue with this request.' : 'The service should deny or ask for a new grant.'}
          </span>
        </div>
      )}
    </ModalShell>
  )
}

export default VerifyConsentModal
