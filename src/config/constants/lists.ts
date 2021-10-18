import { ChainId } from "@pancakeswap/sdk";
import { filterPreferedNetwork } from "utils/networkHelpers";

const MONETADEX_BSC_EXTENDED = 'https://gateway.pinata.cloud/ipfs/QmPQp5qhmYejCNHEpzCYvbf83rwqMj1goaoQb8L6xvokgC'
const MONETADEX_ETHEREUM_EXTENDED = 'https://gateway.pinata.cloud/ipfs/QmPQp5qhmYejCNHEpzCYvbf83rwqMj1goaoQb8L6xvokgC'
const MONETADEX_POLYGON_EXTENDED = 'https://gateway.pinata.cloud/ipfs/QmXPPTK4U2HiaEfupCnDso92WLbX3GS2YbqXxCnA5D5QSt'

export function getDefaultListOfLists(): string[] {
  // TODO this is not the best approach! this should be changed based on the chainId from the wallet
  const networkConfig = filterPreferedNetwork();

  switch (networkConfig.chainId) {
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_TESTNET:
      return [
        MONETADEX_ETHEREUM_EXTENDED,
        ...getUnsupportedListUrls(),
      ]
    case ChainId.BSC_MAINNET:
    case ChainId.BSC_TESTNET:
      return [
        MONETADEX_BSC_EXTENDED,
        ...getUnsupportedListUrls(),
      ]
    case ChainId.POLYGON_MAINNET:
    case ChainId.POLYGON_TESTNET:
      return [
        MONETADEX_POLYGON_EXTENDED,
        ...getUnsupportedListUrls(),
      ]
    default:
      throw new Error('Network not implemented')
  }
}

export function getUnsupportedListUrls(): string[] {
  return []
}

// default lists to be 'active' aka searched across
export function getDefaultActiveListUrls(): string[] {
  return []
}
