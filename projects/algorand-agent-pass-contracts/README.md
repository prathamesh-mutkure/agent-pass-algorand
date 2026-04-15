# AgentPass Contracts

This package contains the AgentPass smart contract written in Algorand TypeScript (PuyaTs), along with deployment code and generated client artifacts.

## Contract summary

The contract lives at [smart_contracts/agent_pass/contract.algo.ts](./smart_contracts/agent_pass/contract.algo.ts).

It supports the MVP flow:

- `createApplication()`: initializes the agent ID counter
- `hello(name)`: retained as a smoke-test method for deployment
- `registerAgent(name, metadata)`: stores an agent record and returns its ID
- `grantConsent(agentId, scope, expiresAt)`: stores a consent record for the agent owner
- `revokeConsent(agentId, scope)`: deletes a consent record for the agent owner
- `verifyConsent(agentId, scope)`: readonly consent check
- `getAgent(agentId)`: readonly agent lookup

State layout:

- Global state:
  - `nextId`
- Box maps:
  - `agents`
  - `consents`

## Prerequisites

- Node.js 22+
- AlgoKit CLI
- Docker for LocalNet

## Commands

Build contracts and regenerate artifacts:

```bash
pnpm build
```

Run the deployment script once:

```bash
pnpm deploy:ci
```

Type-check the deployment and generated TypeScript:

```bash
pnpm check-types
```

For the monorepo-level workflow, you can also run:

```bash
algokit project run build
algokit project deploy localnet
```

## Deployment notes

- The deploy script is [smart_contracts/agent_pass/deploy-config.ts](./smart_contracts/agent_pass/deploy-config.ts).
- Because `createApplication()` is an ABI create method, deploy calls must include:

```ts
createParams: { method: 'createApplication', args: [] }
```

- When the app is newly created, the deploy script funds the app account with `1 ALGO` to cover box minimum balance requirements for the MVP demo.

## Generated artifacts

Build output is written to:

- [smart_contracts/artifacts/agent_pass](./smart_contracts/artifacts/agent_pass)

That includes:

- ARC-32 and ARC-56 specs
- approval and clear TEAL
- generated typed client used by the contracts package

## MVP verification

The current MVP is validated primarily by:

- successful build and typed client generation
- successful deploy and `hello('world')` smoke call
- frontend click-through on LocalNet or TestNet

There are no dedicated automated contract tests yet because the hackathon scope is focused on demo readiness.
