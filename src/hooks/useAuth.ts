import { useCallback } from 'react'
import { UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorLocalStorageKey, NetworkConfig } from '@monetadex/uikit'
import { getConnectorsByNameAndNetwork } from 'utils/web3React'
import { setupNetwork, switchNetwork } from 'utils/wallet'
import useToast from 'hooks/useToast'
import { profileClear } from 'state/profile'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from './useActiveWeb3React'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { activate, deactivate, chainId } = useActiveWeb3React()
  const { toastError } = useToast()

  const login = useCallback(
    (connectorID: ConnectorNames, networkConfig: NetworkConfig) => {
      if (chainId === networkConfig.chainId) {
        const connector = getConnectorsByNameAndNetwork(connectorID, networkConfig)
        if (connector) {
          activate(connector, async (error: Error) => {
            if (error instanceof UnsupportedChainIdError) {
              const hasSetup = await setupNetwork()
              if (hasSetup) {
                activate(connector)
              }
            } else {
              window.localStorage.removeItem(connectorLocalStorageKey)
              if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
                toastError(t('Provider Error'), t('No provider was found'))
              } else if (
                error instanceof UserRejectedRequestErrorInjected ||
                error instanceof UserRejectedRequestErrorWalletConnect
              ) {
                if (connector instanceof WalletConnectConnector) {
                  const walletConnector = connector as WalletConnectConnector
                  walletConnector.walletConnectProvider = null
                }
                toastError(t('Authorization Error'), t('Please authorize to access your account'))
              } else {
                toastError(error.name, error.message)
              }
            }
          })
        } else {
          toastError(t('Unable to find connector'), t('The connector config is wrong'))
        }
      } else {
        switchNetwork(networkConfig.chainId)
      }
    },
    [t, activate, toastError, chainId],
  )

  const logout = useCallback(() => {
    dispatch(profileClear())
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      // TODO this should be fixed
      // connectorsByName.walletconnect.close()
      // connectorsByName.walletconnect.walletConnectProvider = null
    }
  }, [deactivate, dispatch])

  return { login, logout }
}

export default useAuth
