/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT?: string
  readonly VITE_DEFAULT_NETWORK?: string
  readonly VITE_ENABLE_LOCALNET?: string

  readonly VITE_ALGOD_TOKEN?: string
  readonly VITE_ALGOD_SERVER?: string
  readonly VITE_ALGOD_PORT?: string
  readonly VITE_ALGOD_NETWORK?: string

  readonly VITE_INDEXER_TOKEN?: string
  readonly VITE_INDEXER_SERVER?: string
  readonly VITE_INDEXER_PORT?: string

  readonly VITE_KMD_TOKEN?: string
  readonly VITE_KMD_SERVER?: string
  readonly VITE_KMD_PORT?: string
  readonly VITE_KMD_PASSWORD?: string
  readonly VITE_KMD_WALLET?: string

  readonly VITE_LOCALNET_ALGOD_TOKEN?: string
  readonly VITE_LOCALNET_ALGOD_SERVER?: string
  readonly VITE_LOCALNET_ALGOD_PORT?: string
  readonly VITE_LOCALNET_INDEXER_TOKEN?: string
  readonly VITE_LOCALNET_INDEXER_SERVER?: string
  readonly VITE_LOCALNET_INDEXER_PORT?: string
  readonly VITE_LOCALNET_KMD_TOKEN?: string
  readonly VITE_LOCALNET_KMD_SERVER?: string
  readonly VITE_LOCALNET_KMD_PORT?: string
  readonly VITE_LOCALNET_KMD_PASSWORD?: string
  readonly VITE_LOCALNET_KMD_WALLET?: string

  readonly VITE_TESTNET_ALGOD_TOKEN?: string
  readonly VITE_TESTNET_ALGOD_SERVER?: string
  readonly VITE_TESTNET_ALGOD_PORT?: string
  readonly VITE_TESTNET_INDEXER_TOKEN?: string
  readonly VITE_TESTNET_INDEXER_SERVER?: string
  readonly VITE_TESTNET_INDEXER_PORT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
