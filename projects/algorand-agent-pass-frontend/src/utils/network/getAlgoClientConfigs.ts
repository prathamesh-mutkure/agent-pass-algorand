import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network'

export function getAlgodConfigFromViteEnvironment(): AlgoViteClientConfig {
  const { VITE_ALGOD_SERVER, VITE_ALGOD_PORT, VITE_ALGOD_TOKEN, VITE_ALGOD_NETWORK } = import.meta.env

  if (!VITE_ALGOD_SERVER || VITE_ALGOD_PORT === undefined || VITE_ALGOD_TOKEN === undefined || !VITE_ALGOD_NETWORK) {
    throw new Error('Attempt to get default algod configuration without specifying VITE_ALGOD_* in the environment variables')
  }

  return {
    server: VITE_ALGOD_SERVER,
    port: VITE_ALGOD_PORT,
    token: VITE_ALGOD_TOKEN,
    network: VITE_ALGOD_NETWORK,
  }
}

export function getIndexerConfigFromViteEnvironment(): AlgoViteClientConfig {
  const { VITE_INDEXER_SERVER, VITE_INDEXER_PORT, VITE_INDEXER_TOKEN, VITE_ALGOD_NETWORK } = import.meta.env

  if (!VITE_INDEXER_SERVER || VITE_INDEXER_PORT === undefined || VITE_INDEXER_TOKEN === undefined || !VITE_ALGOD_NETWORK) {
    throw new Error('Attempt to get default algod configuration without specifying VITE_INDEXER_* in the environment variables')
  }

  return {
    server: VITE_INDEXER_SERVER,
    port: VITE_INDEXER_PORT,
    token: VITE_INDEXER_TOKEN,
    network: VITE_ALGOD_NETWORK,
  }
}

export function getKmdConfigFromViteEnvironment(): AlgoViteKMDConfig {
  const { VITE_KMD_SERVER, VITE_KMD_PORT, VITE_KMD_TOKEN, VITE_KMD_WALLET, VITE_KMD_PASSWORD } = import.meta.env

  if (!VITE_KMD_SERVER || VITE_KMD_PORT === undefined || VITE_KMD_TOKEN === undefined || VITE_KMD_WALLET === undefined || VITE_KMD_PASSWORD === undefined) {
    throw new Error('Attempt to get default kmd configuration without specifying VITE_KMD_* in the environment variables')
  }

  return {
    server: VITE_KMD_SERVER,
    port: VITE_KMD_PORT,
    token: VITE_KMD_TOKEN,
    wallet: VITE_KMD_WALLET,
    password: VITE_KMD_PASSWORD,
  }
}
