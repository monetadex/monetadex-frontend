import { filterPreferedNetwork } from "utils/networkHelpers";

const MONETADEX_EXTENDED = 'https://api.1inch.exchange/v3.0/{CHAIN_ID}/tokens'

const CHAIN_ID_PLACEHOLDER = '{CHAIN_ID}'

export function getDefaultListOfLists(): string[] {
  const networkConfig = filterPreferedNetwork();

  return [
    MONETADEX_EXTENDED.replace(CHAIN_ID_PLACEHOLDER, networkConfig.chainId),
    ...getUnsupportedListUrls(), // need to load unsupported tokens as well
  ]
}

export function getUnsupportedListUrls(): string[] {
  return []
}

// default lists to be 'active' aka searched across
export function getDefaultActiveListUrls(): string[] {
  return []
}
