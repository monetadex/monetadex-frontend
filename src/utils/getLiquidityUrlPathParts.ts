// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { ChainId } from '@pancakeswap/sdk'
import { getWbnbAddress } from './addressHelpers'

const getLiquidityUrlPathParts = ({ quoteTokenAddress, tokenAddress }) => {
  const chainId = ChainId.BSC_MAINNET
  const wBNBAddressString = getWbnbAddress()
  const quoteTokenAddressString: string = quoteTokenAddress ? quoteTokenAddress[chainId] : null
  const tokenAddressString: string = tokenAddress ? tokenAddress[chainId] : null
  const firstPart =
    !quoteTokenAddressString || quoteTokenAddressString === wBNBAddressString ? 'BNB' : quoteTokenAddressString
  const secondPart = !tokenAddressString || tokenAddressString === wBNBAddressString ? 'BNB' : tokenAddressString
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
