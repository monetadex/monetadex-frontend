import React from 'react'
import styled from 'styled-components'
import { Flex, useModal, CalculateIcon, Skeleton, FlexProps, Button } from '@monetadex/uikit'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import Balance from 'components/Balance'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getAprData } from 'views/Pools/helpers'
import { getAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'

const AprLabelContainer = styled(Flex)`
  &:hover {
    opacity: 0.5;
  }
`

interface AprProps extends FlexProps {
  pool: Pool
  stakedBalance: BigNumber
  showIcon: boolean
  performanceFee?: number
}

const Apr: React.FC<AprProps> = ({ pool, showIcon, stakedBalance, performanceFee = 0, ...props }) => {
  const { stakingToken, earningToken, isFinished, earningTokenPrice, stakingTokenPrice, userData, apr } = pool
  const { t } = useTranslation()

  const { apr: earningsPercentageToDisplay, autoCompoundFrequency } = getAprData(pool, performanceFee)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const apyModalLink = stakingToken.address ? `/swap?outputCurrency=${getAddress(stakingToken.address)}` : '/swap'

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      earningTokenPrice={earningTokenPrice}
      stakingTokenPrice={stakingTokenPrice}
      stakingTokenBalance={stakedBalance.plus(stakingTokenBalance)}
      apr={apr}
      stakingTokenSymbol={stakingToken.symbol}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink}
      earningTokenSymbol={earningToken.symbol}
      autoCompoundFrequency={autoCompoundFrequency}
      performanceFee={performanceFee}
    />,
  )

  const openRoiModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <AprLabelContainer alignItems="center" justifyContent="space-between" {...props}>
      {earningsPercentageToDisplay || isFinished ? (
        <>
          <Balance
            onClick={openRoiModal}
            fontSize="16px"
            isDisabled={isFinished}
            value={isFinished ? 0 : earningsPercentageToDisplay}
            decimals={2}
            unit="%"
          />
          {!isFinished && showIcon && (
            <Button onClick={openRoiModal} variant="text" width="20px" height="20px" padding="0px" marginLeft="4px">
              <CalculateIcon color="textSubtle" width="20px" />
            </Button>
          )}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </AprLabelContainer>
  )
}

export default Apr
