import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAgentPassClient } from '../hooks/useAgentPassClient'

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
    <dialog id="grant_consent_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Grant Consent</h3>
        <p className="py-2 text-sm opacity-70">Authorize your agent to act on a specific scope until it expires.</p>
        <input
          type="number"
          placeholder="Agent ID (e.g. 1)"
          className="input input-bordered w-full my-2"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Scope (e.g. profile.read)"
          className="input input-bordered w-full my-2"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        />
        <input
          type="number"
          placeholder="Expires in (minutes)"
          className="input input-bordered w-full my-2"
          value={expiresInMinutes}
          onChange={(e) => setExpiresInMinutes(e.target.value)}
        />
        <div className="modal-action">
          <button type="button" className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={submit}
            disabled={!agentId || !scope || !expiresInMinutes || loading}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Grant Consent'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default GrantConsentModal
