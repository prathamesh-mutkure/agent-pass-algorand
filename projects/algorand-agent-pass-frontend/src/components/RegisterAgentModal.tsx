import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAgentPassClient } from '../hooks/useAgentPassClient'

interface RegisterAgentModalProps {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const RegisterAgentModal = ({ openModal, setModalState }: RegisterAgentModalProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [metadata, setMetadata] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const { getClient } = useAgentPassClient()

  const submit = async () => {
    setLoading(true)
    try {
      const client = await getClient()
      const res = await client.send.registerAgent({ args: { name, metadata } })
      enqueueSnackbar(`Agent registered. ID: ${res.return?.toString()}`, { variant: 'success' })
      setName('')
      setMetadata('')
      setModalState(false)
    } catch (e: unknown) {
      enqueueSnackbar(`Error: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="register_agent_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Register an AI Agent</h3>
        <p className="py-2 text-sm opacity-70">Creates an on-chain identity for your agent. You become the owner.</p>
        <input
          type="text"
          placeholder="Agent name (e.g. MyResearchBot)"
          className="input input-bordered w-full my-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Metadata (e.g. https://mybot.example)"
          className="input input-bordered w-full my-2"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
        />
        <div className="modal-action">
          <button type="button" className="btn" onClick={() => setModalState(false)}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={submit} disabled={!name || loading}>
            {loading ? <span className="loading loading-spinner" /> : 'Register Agent'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default RegisterAgentModal
