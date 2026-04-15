import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { useWallet } from '@txnlab/use-wallet-react'
import { AgentPassClient, AgentPassFactory } from '../contracts/AgentPass'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

const APP_ID_KEY = 'AGENT_PASS_APP_ID'

Config.configure({ populateAppCallResources: true })

export const resetAgentPassApp = () => {
  localStorage.removeItem(APP_ID_KEY)
}

export const getCachedAgentPassAppId = (): string | null => {
  return localStorage.getItem(APP_ID_KEY)
}

export const useAgentPassClient = () => {
  const { transactionSigner, activeAddress } = useWallet()

  const getClient = async (): Promise<AgentPassClient> => {
    if (!activeAddress) {
      throw new Error('Connect a wallet first')
    }

    const algodConfig = getAlgodConfigFromViteEnvironment()
    const indexerConfig = getIndexerConfigFromViteEnvironment()
    const algorand = AlgorandClient.fromConfig({ algodConfig, indexerConfig })
    algorand.setDefaultSigner(transactionSigner)

    const cachedId = localStorage.getItem(APP_ID_KEY)
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

    localStorage.setItem(APP_ID_KEY, appClient.appId.toString())
    return appClient
  }

  return { getClient }
}
