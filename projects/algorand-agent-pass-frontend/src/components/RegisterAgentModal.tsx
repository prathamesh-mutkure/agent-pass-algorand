import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useAgentPassClient } from '../hooks/useAgentPassClient'
import { Button } from './ui/Button'
import { ModalShell } from './ui/ModalShell'

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
    <ModalShell
      open={openModal}
      onClose={() => setModalState(false)}
      eyebrow="Step 1"
      title="Register an agent identity"
      description="Create a verifiable on-chain identity for your AI agent. The connected wallet becomes the owner."
      footer={
        <>
          <Button variant="ghost" onClick={() => setModalState(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={!name || loading}>
            {loading ? 'Registering...' : 'Register agent'}
          </Button>
        </>
      }
    >
      <div className="form-grid">
        <label className="field">
          <span className="field__label">Agent name</span>
          <input
            type="text"
            placeholder="MyResearchBot"
            className="field__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field__label">Metadata URL or descriptor</span>
          <input
            type="text"
            placeholder="https://mybot.example"
            className="field__input"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
          />
        </label>
      </div>
    </ModalShell>
  )
}

export default RegisterAgentModal
