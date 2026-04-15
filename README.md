# AgentPass

AgentPass is a hackathon MVP for decentralized agent identity and consent on Algorand.

The current scope is intentionally narrow and demo-friendly:

- Register an AI agent on-chain
- Grant consent for a free-form scope such as `profile.read`
- Verify consent through a readonly call
- Revoke consent
- Run the same flow on LocalNet during development and TestNet for demos

The implementation plan and handoff checklist live in [PLAN.md](./PLAN.md) and [TASKS.md](./TASKS.md).

## Repo layout

- [projects/algorand-agent-pass-contracts](./projects/algorand-agent-pass-contracts/README.md): PuyaTs smart contract, deployment script, and generated artifacts
- [projects/algorand-agent-pass-frontend](./projects/algorand-agent-pass-frontend/README.md): React frontend with wallet integration and typed app client usage

## Quick start

1. Install prerequisites:
   - Node.js 22+
   - AlgoKit CLI
   - Docker for LocalNet
2. Bootstrap the workspace:

```bash
algokit project bootstrap all
```

3. Generate a localnet env file for the contracts package if you do not already have one:

```bash
cd projects/algorand-agent-pass-contracts
algokit generate env-file -a target_network localnet
```

4. Start LocalNet:

```bash
algokit localnet start
```

5. Build the contract and regenerate typed clients:

```bash
algokit project run build
```

6. Deploy the contract to LocalNet:

```bash
cd projects/algorand-agent-pass-contracts
pnpm deploy:ci
```

7. Start the frontend:

```bash
cd ../algorand-agent-pass-frontend
pnpm dev
```

## Demo flow

1. Pick `LocalNet` or `TestNet` in the frontend.
2. Connect a wallet for that network.
2. Register an agent with a name and metadata URL.
3. Grant consent for a scope such as `profile.read`.
4. Verify that the consent is `true`.
5. Verify a different scope to see `false`.
6. Revoke consent and verify again.

## Notes

- The frontend supports both LocalNet and TestNet at runtime without swapping the build.
- LocalNet stays env-driven; TestNet uses Algonode public endpoints by default and can be overridden in the frontend `.env`.
- The frontend caches deployed app IDs per network in `localStorage`.
- The reset button in the UI clears the cached app ID for the currently selected network so the next action redeploys the contract there.
- Readonly methods such as `verifyConsent` and `getAgent` are exposed through the typed client and execute via simulation.
