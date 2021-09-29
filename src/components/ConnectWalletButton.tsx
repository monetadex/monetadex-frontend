import React from 'react'
import { Button, ButtonProps, NetworkConfig, useWalletModal } from '@monetadex/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

interface ConnectWalletProps extends ButtonProps {
  networkConfig?: NetworkConfig;
}

const ConnectWalletButton: React.FC<ConnectWalletProps> = ({networkConfig, ...props}) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, networkConfig, logout)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {t('Connect Wallet')}
    </Button>
  )
}

export default ConnectWalletButton
