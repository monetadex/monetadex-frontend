import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames, NetworkConfig } from '@monetadex/uikit'
import { ethers } from 'ethers'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'
import { sample } from 'lodash'

const POLLING_INTERVAL = 12000

const MANIFEST_EMAIL = "..."
const MANIFEST_APP_URL = "..."

export const getConnectorsByNameAndNetwork = (connectorName: ConnectorNames, network: NetworkConfig) => {
  console.log(network);
  console.log(parseInt(network.chainId, 10));
  switch (connectorName) {
    case ConnectorNames.Injected:
      return new InjectedConnector({ supportedChainIds: [parseInt(network.chainId, 10)] })
    case ConnectorNames.WalletConnect:
      return new WalletConnectConnector({ rpc: { [parseInt(network.chainId, 10)]: sample(network.rpcUrl) }, qrcode: true, pollingInterval: POLLING_INTERVAL, })
    case ConnectorNames.BSC:
      return new BscConnector({ supportedChainIds: [parseInt(network.chainId, 10)] })
    case ConnectorNames.Ledger:
      return new LedgerConnector({ chainId: parseInt(network.chainId, 10), url: sample(network.rpcUrl), pollingInterval: POLLING_INTERVAL });
    case ConnectorNames.Trezor:
      return new TrezorConnector({ chainId: parseInt(network.chainId, 10), url: sample(network.rpcUrl), pollingInterval: POLLING_INTERVAL, manifestEmail: MANIFEST_EMAIL, manifestAppUrl: MANIFEST_APP_URL });
    default:
      throw new Error(`Not Expected`)
  }
}

export const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (provider: any, account: string, message: string): Promise<string> => {
  if (window.BinanceChain) {
    const { signature } = await window.BinanceChain.bnbSign(account, message)
    return signature
  }

  /**
   * Wallet Connect does not sign the message correctly unless you use their method
   * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
   */
  if (provider.provider?.wc) {
    const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
    const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
    return signature
  }

  return provider.getSigner(account).signMessage(message)
}
