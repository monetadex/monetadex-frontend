import React from 'react'
import { Box, Button, Text } from '@monetadex/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { setHistoryPaneState } from 'state/predictions'
import Notification from './Notification'

const PauseNotification = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleOpenHistory = () => {
    dispatch(setHistoryPaneState(true))
  }

  return (
    <Notification title={t('Markets Paused')}>
      <Box mb="24px">
        <Text as="p">{t('Prediction markets have been paused due to an error.')}</Text>
        <Text as="p">{t('All open positions have been canceled.')}</Text>
        <Text as="p">
          {t('You can reclaim any funds entered into existing positions via the History tab on this page.')}
        </Text>
      </Box>
      <Button variant="primary" width="100%" onClick={handleOpenHistory}>
        {t('Show History')}
      </Button>
    </Notification>
  )
}

export default PauseNotification
