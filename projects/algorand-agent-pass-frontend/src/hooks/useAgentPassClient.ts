import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { useNetwork, useWallet } from '@txnlab/use-wallet-react'
import { AgentPassClient, AgentPassFactory } from '../contracts/AgentPass'
import { getAlgodConfigForNetwork, getIndexerConfigForNetwork, resolveAgentPassNetwork } from '../utils/network/agentPassNetwork'

const APP_ID_KEY_PREFIX = 'AGENT_PASS_APP_ID'

Config.configure({ populateAppCallResources: true })

const getAgentPassAppStorageKey = (networkId: string) => `${APP_ID_KEY_PREFIX}_${networkId}`

export const resetAgentPassApp = (networkId?: string) => {
  if (networkId) {
    localStorage.removeItem(getAgentPassAppStorageKey(networkId))
    return
  }

  Object.keys(localStorage)
    .filter((key) => key.startsWith(APP_ID_KEY_PREFIX))
    .forEach((key) => localStorage.removeItem(key))
}

export const getCachedAgentPassAppId = (networkId: string): string | null => {
  return localStorage.getItem(getAgentPassAppStorageKey(networkId))
}

export const useAgentPassClient = () => {
  const { transactionSigner, activeAddress } = useWallet()
  const { activeNetwork } = useNetwork()

  const getClient = async (): Promise<AgentPassClient> => {
    if (!activeAddress) {
      throw new Error('Connect a wallet first')
    }

    const networkId = resolveAgentPassNetwork(activeNetwork)
    const algodConfig = getAlgodConfigForNetwork(networkId)
    const indexerConfig = getIndexerConfigForNetwork(networkId)
    const algorand = AlgorandClient.fromConfig({ algodConfig, indexerConfig })
    algorand.setDefaultSigner(transactionSigner)

    const cachedId = getCachedAgentPassAppId(networkId)
    if (cachedId) {
      return algorand.client.getTypedAppClientById(AgentPassClient, {
        appId: BigInt(cachedId),
        defaultSender: activeAddress,
      })
    }

    const factory = new AgentPassFactory({
      defaultSender: activeAddress,
      algorand,
    })

    const { appClient, result } = await factory.deploy({
      onSchemaBreak: OnSchemaBreak.AppendApp,
      onUpdate: OnUpdate.AppendApp,
      createParams: { method: 'createApplication', args: [] },
    })

    if (['create', 'replace'].includes(result.operationPerformed)) {
      await algorand.send.payment({
        amount: (1).algo(),
        sender: activeAddress,
        receiver: appClient.appAddress,
      })
    }

    localStorage.setItem(getAgentPassAppStorageKey(networkId), appClient.appId.toString())
    return appClient
  }

  return { getClient }
}
