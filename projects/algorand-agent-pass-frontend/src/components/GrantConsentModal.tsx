import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAgentPassClient } from '../hooks/useAgentPassClient'
import { Button } from './ui/Button'
import { ModalShell } from './ui/ModalShell'

interface GrantConsentModalProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const GrantConsentModal = ({ openModal, setModalState }: GrantConsentModalProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [agentId, setAgentId] = useState<string>('')
  const [scope, setScope] = useState<string>('profile.read')
  const [expiresInMinutes, setExpiresInMinutes] = useState<string>('60')
  const { enqueueSnackbar } = useSnackbar()
  const { getClient } = useAgentPassClient()

  const submit = async () => {
    setLoading(true)
    try {
      const client = await getClient()
      const expiresAt = BigInt(Math.floor(Date.now() / 1000) + Number(expiresInMinutes) * 60)
      await client.send.grantConsent({
        args: { agentId: BigInt(agentId), scope, expiresAt },
      })
      enqueueSnackbar(`Consent granted to agent ${agentId} for "${scope}"`, { variant: 'success' })
      setModalState(false)
    } catch (e: unknown) {
      enqueueSnackbar(`Error: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell
      open={openModal}
      onClose={() => setModalState(false)}
      eyebrow="Step 2"
      title="Grant scoped consent"
      description="Authorize the agent to act on a single scope for a limited time window."
      footer={
        <>
          <Button variant="ghost" onClick={() => setModalState(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={submit} disabled={!agentId || !scope || !expiresInMinutes || loading}>
            {loading ? 'Granting...' : 'Grant consent'}
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
        <label className="field">
          <span className="field__label">Expiry in minutes</span>
          <input
            type="number"
            placeholder="60"
            className="field__input"
            value={expiresInMinutes}
            onChange={(e) => setExpiresInMinutes(e.target.value)}
          />
        </label>
      </div>
    </ModalShell>
  )
}

export default GrantConsentModal
