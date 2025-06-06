import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { Box, Flex, FlexProps, Text } from '@monetadex/uikit'
import { useTranslation } from 'contexts/Localization'
import { BetPosition, NodeRound, Round } from 'state/types'
import { formatUsdv2, formatBnbv2 } from '../../helpers'
import { formatBnb, formatUsd } from '../History/helpers'

// PrizePoolRow
interface PrizePoolRowProps extends FlexProps {
  totalAmount: NodeRound['totalAmount']
}

const getPrizePoolAmount = (totalAmount: PrizePoolRowProps['totalAmount']) => {
  if (!totalAmount) {
    return '0'
  }

  return formatBnbv2(totalAmount)
}

const Row = ({ children, ...props }) => {
  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {children}
    </Flex>
  )
}

export const PrizePoolRow: React.FC<PrizePoolRowProps> = ({ totalAmount, ...props }) => {
  const { t } = useTranslation()

  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmount(totalAmount)} BNB`}</Text>
    </Row>
  )
}

// Payout Row
interface PayoutRowProps extends FlexProps {
  positionLabel: string
  multiplier: number
  amount: number
}

export const PayoutRow: React.FC<PayoutRowProps> = ({ positionLabel, multiplier, amount, ...props }) => {
  const { t } = useTranslation()
  const formattedMultiplier = `${multiplier.toLocaleString(undefined, { maximumFractionDigits: 2 })}x`

  return (
    <Row height="18px" {...props}>
      <Text fontSize="12px" textTransform="uppercase">
        {positionLabel}:
      </Text>
      <Flex alignItems="center">
        <Text fontSize="12px" lineHeight="18px" bold>
          {t('%multiplier% Payout', { multiplier: formattedMultiplier })}
        </Text>
        <Text mx="4px">|</Text>
        <Text fontSize="12px" lineHeight="18px">{`${formatBnb(amount)} BNB`}</Text>
      </Flex>
    </Row>
  )
}

interface LockPriceRowProps extends FlexProps {
  lockPrice: NodeRound['lockPrice']
}

export const LockPriceRow: React.FC<LockPriceRowProps> = ({ lockPrice, ...props }) => {
  const { t } = useTranslation()

  return (
    <Row {...props}>
      <Text fontSize="14px">{t('Locked Price')}:</Text>
      <Text fontSize="14px">{formatUsdv2(lockPrice)}</Text>
    </Row>
  )
}

// RoundResultBox
interface RoundResultBoxProps {
  betPosition?: BetPosition
  isNext?: boolean
  isLive?: boolean
  hasEntered?: boolean
}

const getBackgroundColor = ({
  theme,
  betPosition,
  isNext,
  isLive,
  hasEntered,
}: RoundResultBoxProps & { theme: DefaultTheme }) => {
  if (isNext) {
    return 'linear-gradient(180deg, #53DEE9 0%, #7645D9 100%)'
  }

  if (hasEntered || isLive) {
    return theme.colors.secondary
  }

  if (betPosition === BetPosition.BULL) {
    return theme.colors.success
  }

  if (betPosition === BetPosition.BEAR) {
    return theme.colors.failure
  }

  return theme.colors.cardBorder
}

const Background = styled(Box)<RoundResultBoxProps>`
  background: ${getBackgroundColor};
  border-radius: 16px;
  padding: 2px;
`

const StyledRoundResultBox = styled.div`
  background: ${({ theme }) => theme.card.background};
  border-radius: 14px;
  padding: 16px;
`

export const RoundResultBox: React.FC<RoundResultBoxProps> = ({
  isNext = false,
  hasEntered = false,
  isLive = false,
  children,
  ...props
}) => {
  return (
    <Background isNext={isNext} hasEntered={hasEntered} isLive={isLive} {...props}>
      <StyledRoundResultBox>{children}</StyledRoundResultBox>
    </Background>
  )
}

/**
 * TODO: Remove
 *
 * This is a temporary function until we consolidate the data coming from the graph versus the node
 */
interface PrizePoolHistoryRowProps extends FlexProps {
  totalAmount: number
}

const getPrizePoolAmountHistory = (totalAmount: PrizePoolHistoryRowProps['totalAmount']) => {
  if (!totalAmount) {
    return '0'
  }

  return formatBnb(totalAmount)
}

export const PrizePoolHistoryRow: React.FC<PrizePoolHistoryRowProps> = ({ totalAmount, ...props }) => {
  const { t } = useTranslation()

  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmountHistory(totalAmount)} BNB`}</Text>
    </Row>
  )
}

interface LockPriceHistoryRowProps extends FlexProps {
  lockPrice: Round['lockPrice']
}

export const LockPriceHistoryRow: React.FC<LockPriceHistoryRowProps> = ({ lockPrice, ...props }) => {
  const { t } = useTranslation()

  return (
    <Row {...props}>
      <Text fontSize="14px">{t('Locked Price')}:</Text>
      <Text fontSize="14px">{formatUsd(lockPrice)}</Text>
    </Row>
  )
}
/**
 * END TEMPORARY COMPONENTS
 */
