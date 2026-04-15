import { NetworkId, SupportedWallet, WalletId } from '@txnlab/use-wallet-react'
import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network'

const LOCALNET_TOKEN = 'a'.repeat(64)

type AgentPassClientConfig = Omit<AlgoViteClientConfig, 'token'> & { token: string }
type AgentPassKmdConfig = Omit<AlgoViteKMDConfig, 'token'> & { token: string }

export const AGENT_PASS_NETWORKS = [NetworkId.LOCALNET, NetworkId.TESTNET] as const

export type AgentPassNetworkId = (typeof AGENT_PASS_NETWORKS)[number]

export const isLocalnetEnabled = (): boolean => {
  return import.meta.env.VITE_ENABLE_LOCALNET !== 'false'
}

export const getEnabledAgentPassNetworks = (): AgentPassNetworkId[] => {
  return isLocalnetEnabled() ? [...AGENT_PASS_NETWORKS] : [NetworkId.TESTNET]
}

export const isAgentPassNetworkId = (value: string): value is AgentPassNetworkId => {
  return AGENT_PASS_NETWORKS.includes(value as AgentPassNetworkId)
}

export const getDefaultAgentPassNetwork = (): AgentPassNetworkId => {
  const configuredNetwork = (import.meta.env.VITE_DEFAULT_NETWORK ?? import.meta.env.VITE_ALGOD_NETWORK ?? NetworkId.LOCALNET).toLowerCase()
  const enabledNetworks = getEnabledAgentPassNetworks()

  if (isAgentPassNetworkId(configuredNetwork) && enabledNetworks.includes(configuredNetwork)) {
    return configuredNetwork
  }

  return enabledNetworks[0]
}

export const resolveAgentPassNetwork = (networkId?: string): AgentPassNetworkId => {
  if (networkId) {
    const normalizedNetwork = networkId.toLowerCase()
    if (isAgentPassNetworkId(normalizedNetwork)) {
      return normalizedNetwork
    }
  }

  return getDefaultAgentPassNetwork()
}

export const getLocalnetAlgodConfig = (): AgentPassClientConfig => {
  return {
    server: import.meta.env.VITE_LOCALNET_ALGOD_SERVER ?? import.meta.env.VITE_ALGOD_SERVER ?? 'http://localhost',
    port: import.meta.env.VITE_LOCALNET_ALGOD_PORT ?? import.meta.env.VITE_ALGOD_PORT ?? '4001',
    token: import.meta.env.VITE_LOCALNET_ALGOD_TOKEN ?? import.meta.env.VITE_ALGOD_TOKEN ?? LOCALNET_TOKEN,
    network: NetworkId.LOCALNET,
  } satisfies AgentPassClientConfig
}

export const getLocalnetIndexerConfig = (): AgentPassClientConfig => {
  return {
    server: import.meta.env.VITE_LOCALNET_INDEXER_SERVER ?? import.meta.env.VITE_INDEXER_SERVER ?? 'http://localhost',
    port: import.meta.env.VITE_LOCALNET_INDEXER_PORT ?? import.meta.env.VITE_INDEXER_PORT ?? '8980',
    token: import.meta.env.VITE_LOCALNET_INDEXER_TOKEN ?? import.meta.env.VITE_INDEXER_TOKEN ?? LOCALNET_TOKEN,
    network: NetworkId.LOCALNET,
  } satisfies AgentPassClientConfig
}

export const getLocalnetKmdConfig = (): AgentPassKmdConfig => {
  return {
    server: import.meta.env.VITE_LOCALNET_KMD_SERVER ?? import.meta.env.VITE_KMD_SERVER ?? 'http://localhost',
    port: import.meta.env.VITE_LOCALNET_KMD_PORT ?? import.meta.env.VITE_KMD_PORT ?? '4002',
    token: import.meta.env.VITE_LOCALNET_KMD_TOKEN ?? import.meta.env.VITE_KMD_TOKEN ?? LOCALNET_TOKEN,
    wallet: import.meta.env.VITE_LOCALNET_KMD_WALLET ?? import.meta.env.VITE_KMD_WALLET ?? 'unencrypted-default-wallet',
    password: import.meta.env.VITE_LOCALNET_KMD_PASSWORD ?? import.meta.env.VITE_KMD_PASSWORD ?? '',
  } satisfies AgentPassKmdConfig
}

export const getTestnetAlgodConfig = (): AgentPassClientConfig => {
  return {
    server: import.meta.env.VITE_TESTNET_ALGOD_SERVER ?? 'https://testnet-api.algonode.cloud',
    port: import.meta.env.VITE_TESTNET_ALGOD_PORT ?? '',
    token: import.meta.env.VITE_TESTNET_ALGOD_TOKEN ?? '',
    network: NetworkId.TESTNET,
  } satisfies AgentPassClientConfig
}

export const getTestnetIndexerConfig = (): AgentPassClientConfig => {
  return {
    server: import.meta.env.VITE_TESTNET_INDEXER_SERVER ?? 'https://testnet-idx.algonode.cloud',
    port: import.meta.env.VITE_TESTNET_INDEXER_PORT ?? '',
    token: import.meta.env.VITE_TESTNET_INDEXER_TOKEN ?? '',
    network: NetworkId.TESTNET,
  } satisfies AgentPassClientConfig
}

export const getAlgodConfigForNetwork = (networkId: AgentPassNetworkId): AlgoViteClientConfig => {
  return networkId === NetworkId.TESTNET ? getTestnetAlgodConfig() : getLocalnetAlgodConfig()
}

export const getIndexerConfigForNetwork = (networkId: AgentPassNetworkId): AlgoViteClientConfig => {
  return networkId === NetworkId.TESTNET ? getTestnetIndexerConfig() : getLocalnetIndexerConfig()
}

export const getWalletManagerNetworks = () => {
  const testnetAlgod = getTestnetAlgodConfig()
  const networks: Record<string, { algod: { baseServer: string; port: string | number; token: string } }> = {
    [NetworkId.TESTNET]: {
      algod: {
        baseServer: testnetAlgod.server,
        port: testnetAlgod.port,
        token: testnetAlgod.token,
      },
    },
  }

  if (isLocalnetEnabled()) {
    const localnetAlgod = getLocalnetAlgodConfig()
    networks[NetworkId.LOCALNET] = {
      algod: {
        baseServer: localnetAlgod.server,
        port: localnetAlgod.port,
        token: localnetAlgod.token,
      },
    }
  }

  return networks
}

export const getSupportedWallets = (): SupportedWallet[] => {
  const wallets: SupportedWallet[] = [{ id: WalletId.PERA }, { id: WalletId.DEFLY }]

  if (isLocalnetEnabled()) {
    const localnetKmd = getLocalnetKmdConfig()
    wallets.unshift({
      id: WalletId.KMD,
      options: {
        baseServer: localnetKmd.server,
        token: localnetKmd.token,
        port: localnetKmd.port,
        wallet: localnetKmd.wallet,
      },
    })
  }

  return wallets
}

export const isWalletSupportedOnNetwork = (walletId: WalletId, networkId: string): boolean => {
  const resolvedNetwork = resolveAgentPassNetwork(networkId)
  return resolvedNetwork === NetworkId.LOCALNET ? walletId === WalletId.KMD : walletId !== WalletId.KMD
}

export const getNetworkDisplayName = (networkId: string): string => {
  const resolvedNetwork = resolveAgentPassNetwork(networkId)
  return resolvedNetwork === NetworkId.TESTNET ? 'TestNet' : 'LocalNet'
}

export const getAccountExplorerUrl = (networkId: string, address: string): string => {
  const resolvedNetwork = resolveAgentPassNetwork(networkId)
  return `https://lora.algokit.io/${resolvedNetwork}/account/${address}/`
}
