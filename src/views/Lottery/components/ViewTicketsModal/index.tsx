import React from 'react'
import styled from 'styled-components'
import { Modal } from '@monetadex/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryStatus } from 'config/constants/types'
import { useLottery } from 'state/lottery/hooks'
import useTheme from 'hooks/useTheme'
import PreviousRoundTicketsInner from './PreviousRoundTicketsInner'
import CurrentRoundTicketsInner from './CurrentRoundTicketsInner'

const StyledModal = styled(Modal)`
  min-width: 280px;
  max-width: 320px;
`

interface ViewTicketsModalProps {
  roundId: string
  roundStatus?: LotteryStatus
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<ViewTicketsModalProps> = ({ onDismiss, roundId, roundStatus }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { currentLotteryId } = useLottery()
  const isPreviousRound = roundStatus?.toLowerCase() === LotteryStatus.CLAIMABLE || roundId !== currentLotteryId

  return (
    <StyledModal
      title={`${t('Round')} ${roundId}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {isPreviousRound ? <PreviousRoundTicketsInner roundId={roundId} /> : <CurrentRoundTicketsInner />}
    </StyledModal>
  )
}

export default ViewTicketsModal
