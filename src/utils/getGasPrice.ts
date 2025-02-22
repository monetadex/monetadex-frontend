import { ChainId } from '@pancakeswap/sdk'
import store from 'state'
import { GAS_PRICE_GWEI } from 'state/user/hooks/helpers'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  const chainId = "56"
  const state = store.getState()
  const userGas = state.user.gasPrice || GAS_PRICE_GWEI.default
  return chainId === ChainId.BSC_MAINNET.toString() ? userGas : GAS_PRICE_GWEI.testnet
}

export default getGasPrice
