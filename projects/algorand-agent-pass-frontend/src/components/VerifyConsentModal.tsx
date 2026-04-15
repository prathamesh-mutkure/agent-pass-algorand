import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAgentPassClient } from '../hooks/useAgentPassClient'

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
    <dialog id="verify_consent_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Verify Consent</h3>
        <p className="py-2 text-sm opacity-70">Check whether an agent has valid consent for a scope. Readonly call.</p>
        <input
          type="number"
          placeholder="Agent ID"
          className="input input-bordered w-full my-2"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Scope"
          className="input input-bordered w-full my-2"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        />
        {result !== null && (
          <div className={`alert ${result ? 'alert-success' : 'alert-error'} my-2`}>
            <span>{result ? 'Consent valid' : 'No valid consent'}</span>
          </div>
        )}
        <div className="modal-action flex-wrap">
          <button type="button" className="btn" onClick={close}>
            Close
          </button>
          {result === true && (
            <button type="button" className="btn btn-warning" onClick={revoke} disabled={revoking}>
              {revoking ? <span className="loading loading-spinner" /> : 'Revoke'}
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={verify} disabled={!agentId || !scope || loading}>
            {loading ? <span className="loading loading-spinner" /> : 'Verify'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default VerifyConsentModal
