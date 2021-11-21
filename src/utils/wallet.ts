// Set of helper functions to facilitate wallet setup

import { BASE_SCAN_URLS, BASE_PICTURE_URL } from 'config'
import getNetwork from './getNetwork'
import { getNodes } from './getRpcUrl'

/**
 * Prompt the user to add a network on Metamask
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const network = getNetwork()
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${network.chainId.toString(16)}`,
            chainName: network.name,
            rpcUrls: getNodes(),
            blockExplorerUrls: [`${BASE_SCAN_URLS[network.chainId]}/`],
          },
        ],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: `${BASE_PICTURE_URL}${tokenAddress}.png`,
      },
    },
  })

  return tokenAdded
}

/**
 * Prompt the user to switch to the selected chain
 * @param chainId
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const switchNetwork = async (chainId: number) => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        { chainId: `0x${chainId.toString(16)}` }
      ],
    })

    return true
  } catch (error) {
    console.error('Failed to switch the network in Metamask:', error)
    return false
  }
}