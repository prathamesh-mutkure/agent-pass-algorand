import {
  Contract,
  GlobalState,
  BoxMap,
  Account,
  Txn,
  Global,
  Uint64,
  assert,
  uint64,
  abimethod,
  clone,
} from '@algorandfoundation/algorand-typescript'

type AgentInfo = {
  owner: Account
  name: string
  metadata: string
  createdAt: uint64
}

type ConsentKey = {
  agentId: uint64
  scope: string
}

type ConsentRecord = {
  expiresAt: uint64
}

export class AgentPass extends Contract {
  nextAgentId = GlobalState<uint64>({ key: 'nextId' })
  agents = BoxMap<uint64, AgentInfo>({ keyPrefix: 'a' })
  consents = BoxMap<ConsentKey, ConsentRecord>({ keyPrefix: 'c' })

  public createApplication(): void {
    this.nextAgentId.value = Uint64(1)
  }

  public hello(name: string): string {
    return `Hello, ${name}`
  }

  public registerAgent(name: string, metadata: string): uint64 {
    const agentId: uint64 = this.nextAgentId.value
    this.nextAgentId.value = agentId + Uint64(1)

    const info: AgentInfo = {
      owner: Txn.sender,
      name: name,
      metadata: metadata,
      createdAt: Global.latestTimestamp,
    }
    this.agents(agentId).value = clone(info)
    return agentId
  }

  public grantConsent(agentId: uint64, scope: string, expiresAt: uint64): void {
    assert(this.agents(agentId).exists, 'agent not found')
    const agent = clone(this.agents(agentId).value)
    assert(agent.owner === Txn.sender, 'not owner')
    assert(expiresAt > Global.latestTimestamp, 'expiry must be in future')

    const record: ConsentRecord = { expiresAt: expiresAt }
    this.consents({ agentId: agentId, scope: scope }).value = clone(record)
  }

  public revokeConsent(agentId: uint64, scope: string): void {
    assert(this.agents(agentId).exists, 'agent not found')
    const agent = clone(this.agents(agentId).value)
    assert(agent.owner === Txn.sender, 'not owner')

    this.consents({ agentId: agentId, scope: scope }).delete()
  }

  @abimethod({ readonly: true })
  public verifyConsent(agentId: uint64, scope: string): boolean {
    const key: ConsentKey = { agentId: agentId, scope: scope }
    if (!this.consents(key).exists) {
      return false
    }
    const record = clone(this.consents(key).value)
    return record.expiresAt > Global.latestTimestamp
  }

  @abimethod({ readonly: true })
  public getAgent(agentId: uint64): AgentInfo {
    assert(this.agents(agentId).exists, 'agent not found')
    return clone(this.agents(agentId).value)
  }
}
