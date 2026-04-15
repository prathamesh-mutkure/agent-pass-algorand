# AgentPass Frontend

This package contains the React frontend for the AgentPass MVP.

The UI is focused on the core demo flow:

- connect wallet
- register agent
- grant consent
- verify consent
- revoke consent

## Key pieces

- [src/Home.tsx](./src/Home.tsx): main landing page and modal entry points
- [src/hooks/useAgentPassClient.ts](./src/hooks/useAgentPassClient.ts): builds the typed client, deploys on first use, and caches the app ID per network
- [src/components/RegisterAgentModal.tsx](./src/components/RegisterAgentModal.tsx): registers an agent
- [src/components/GrantConsentModal.tsx](./src/components/GrantConsentModal.tsx): grants consent
- [src/components/VerifyConsentModal.tsx](./src/components/VerifyConsentModal.tsx): verifies and optionally revokes consent
- [src/contracts/AgentPass.ts](./src/contracts/AgentPass.ts): generated typed client copied from the contracts package
- [src/utils/network/agentPassNetwork.ts](./src/utils/network/agentPassNetwork.ts): shared LocalNet/TestNet runtime config for wallets and algod/indexer clients

## Network support

The frontend now supports both `localnet` and `testnet` at runtime.

- Use the network buttons in the home screen to switch between LocalNet and TestNet.
- LocalNet uses KMD.
- TestNet uses wallet providers such as Pera and Defly.
- The default startup network is controlled by `VITE_DEFAULT_NETWORK` and defaults to `localnet`.
- TestNet falls back to Algonode public endpoints unless `VITE_TESTNET_*` overrides are provided.

## App ID caching

The frontend stores deployed app IDs in `localStorage`, keyed by network.

This prevents redeploying on every interaction. During development, the UI exposes a reset button that clears the cached ID for the currently selected network so the next action deploys a fresh app there.

## Commands

Generate or refresh linked app clients:

```bash
pnpm generate:app-clients
```

Start the dev server:

```bash
pnpm dev
```

Build the frontend:

```bash
pnpm build
```

Build the frontend for Vercel without regenerating app clients:

```bash
pnpm build:vercel
```

## Wallet and network notes

- LocalNet development uses the KMD wallet integration from `use-wallet`.
- TestNet uses the same frontend build; switch networks in the UI, connect a TestNet wallet, fund it, and repeat the same flow.
- Readonly contract methods such as `verifyConsent` do not require a wallet signing prompt when routed through the generated client.

## Vercel deployment

If the contract client in [src/contracts/AgentPass.ts](./src/contracts/AgentPass.ts) is already committed and the contract is not changing, deploy the frontend as a static Vite app on Vercel.

Recommended Vercel settings:

- Root directory: `projects/algorand-agent-pass-frontend`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build:vercel`
- Output directory: `dist`

Required environment variables for a public TestNet deployment:

- `VITE_DEFAULT_NETWORK=testnet`
- `VITE_ENABLE_LOCALNET=false`

Optional TestNet overrides:

- `VITE_TESTNET_ALGOD_SERVER`
- `VITE_TESTNET_ALGOD_PORT`
- `VITE_TESTNET_ALGOD_TOKEN`
- `VITE_TESTNET_INDEXER_SERVER`
- `VITE_TESTNET_INDEXER_PORT`
- `VITE_TESTNET_INDEXER_TOKEN`

If you do not set the optional TestNet overrides, the frontend falls back to Algonode public TestNet endpoints.

Important:

- Vercel deploys only the frontend, not the smart contract
- you still need a TestNet app deployment before the public UI can interact with AgentPass reliably
- the easiest path is to predeploy once on TestNet, then use the hosted frontend against that network

## Manual demo checklist

1. Connect wallet.
2. Register `MyBot` with metadata such as `https://bot.example`.
3. Grant consent for agent `1`, scope `profile.read`, expiry `60` minutes.
4. Verify `profile.read` and confirm success.
5. Verify `profile.write` and confirm failure.
6. Revoke consent and verify again if needed.
