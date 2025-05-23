import { ChainId, Token } from '@pancakeswap/sdk'
import { Tags, TokenInfo, TokenList } from '@uniswap/token-lists'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getDefaultListOfLists, getUnsupportedListUrls } from 'config/constants/lists'
import { AppState } from '../index'
import BSC_DEFAULT_TOKEN_LIST from '../../config/constants/tokenLists/monetadex-bsc-default.tokenlist.json'
import ETHEREUM_DEFAULT_TOKEN_LIST from '../../config/constants/tokenLists/monetadex-ethereum-default.tokenlist.json'
import POLIGON_DEFAULT_TOKEN_LIST from '../../config/constants/tokenLists/monetadex-polygon-default.tokenlist.json'
import UNSUPPORTED_TOKEN_LIST from '../../config/constants/tokenLists/monetadex-unsupported.tokenlist.json'

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

// use ordering of default list of lists to assign priority
function sortByListPriority(urlA: string, urlB: string) {
  const first = getDefaultListOfLists().includes(urlA) ? getDefaultListOfLists().indexOf(urlA) : Number.MAX_SAFE_INTEGER
  const second = getDefaultListOfLists().includes(urlB) ? getDefaultListOfLists().indexOf(urlB) : Number.MAX_SAFE_INTEGER

  // need reverse order to make sure mapping includes top priority last
  if (first < second) return 1
  if (first > second) return -1
  return 0
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo

  public readonly tags: TagInfo[]

  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }

  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<
  { [chainId in ChainId]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }> }
>

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.BSC_MAINNET]: {},
  [ChainId.BSC_TESTNET]: {},
  [ChainId.ETHEREUM_MAINNET]: {},
  [ChainId.ETHEREUM_TESTNET]: {},
  [ChainId.POLYGON_MAINNET]: {},
  [ChainId.POLYGON_TESTNET]: {}
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list,
          },
        },
      }
    },
    { ...EMPTY_LIST }
  )


  listCache?.set(list, map)
  return map
}

export function useAllLists(): {
  readonly [url: string]: {
    readonly current: TokenList | null
    readonly pendingUpdate: TokenList | null
    readonly loadingRequestId: string | null
    readonly error: string | null
  }
} {
  return useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
}

function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  return {
    [ChainId.BSC_MAINNET]: { ...map1[ChainId.BSC_MAINNET], ...map2[ChainId.BSC_MAINNET] },
    [ChainId.BSC_TESTNET]: { ...map1[ChainId.BSC_TESTNET], ...map2[ChainId.BSC_TESTNET] },
    [ChainId.ETHEREUM_MAINNET]: { ...map1[ChainId.ETHEREUM_MAINNET], ...map2[ChainId.ETHEREUM_MAINNET] },
    [ChainId.ETHEREUM_TESTNET]: { ...map1[ChainId.ETHEREUM_TESTNET], ...map2[ChainId.ETHEREUM_TESTNET] },
    [ChainId.POLYGON_MAINNET]: { ...map1[ChainId.POLYGON_MAINNET], ...map2[ChainId.POLYGON_MAINNET] },
    [ChainId.POLYGON_TESTNET]: { ...map1[ChainId.POLYGON_TESTNET], ...map2[ChainId.POLYGON_TESTNET] },
  }
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists()

  return useMemo(() => {
    if (!urls) return EMPTY_LIST

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            // TODO this needs to be fexed
            const newTokens = Object.assign(listToTokenMap(current))
            return combineMaps(allTokens, newTokens)
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, EMPTY_LIST)
    )
  }, [lists, urls])
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  return useSelector<AppState, AppState['lists']['activeListUrls']>((state) => state.lists.activeListUrls)?.filter(
    (url) => !getUnsupportedListUrls().includes(url),
  )
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !getUnsupportedListUrls().includes(url))
}

export function useCombinedActiveList(chainId: number): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  const defaultTokenMap = listToTokenMap(getDefaultTokenList(chainId))
  return combineMaps(activeTokens, defaultTokenMap)
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  const allInactiveListUrls: string[] = useInactiveListUrls()
  return useCombinedTokenMapFromUrls(allInactiveListUrls)
}

// used to hide warnings on import for default tokens
export function useDefaultTokenList(chainId: number): TokenAddressMap {
  return listToTokenMap(getDefaultTokenList(chainId))
}

export function getDefaultTokenList(chainId: number) {
  switch (chainId) {
    case ChainId.BSC_MAINNET:
    case ChainId.BSC_TESTNET:
      return BSC_DEFAULT_TOKEN_LIST;
    case ChainId.ETHEREUM_MAINNET:
    case ChainId.ETHEREUM_TESTNET:
      return ETHEREUM_DEFAULT_TOKEN_LIST;
    case ChainId.POLYGON_MAINNET:
    case ChainId.POLYGON_TESTNET:
      return POLIGON_DEFAULT_TOKEN_LIST;
    default:
      throw new Error('Network not implemented')
  }
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(getUnsupportedListUrls())

  // format into one token address map
  return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap)
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}
