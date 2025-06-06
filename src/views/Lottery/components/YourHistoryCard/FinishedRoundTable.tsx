import React from 'react'
import styled from 'styled-components'
import { Text, Box, Flex } from '@monetadex/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryStatus } from 'config/constants/types'
import { useGetUserLotteriesGraphData } from 'state/lottery/hooks'
import FinishedRoundRow from './FinishedRoundRow'

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
`

interface FinishedRoundTableProps {
  handleHistoryRowClick: (string) => void
}

const FinishedRoundTable: React.FC<FinishedRoundTableProps> = ({ handleHistoryRowClick }) => {
  const { t } = useTranslation()
  const userLotteryData = useGetUserLotteriesGraphData()

  const filteredForClaimable = userLotteryData?.rounds.filter((round) => {
    return round.status.toLowerCase() === LotteryStatus.CLAIMABLE
  })

  const sortedByRoundId = filteredForClaimable?.sort((roundA, roundB) => {
    return parseInt(roundB.lotteryId, 10) - parseInt(roundA.lotteryId, 10)
  })

  return (
    <>
      <Grid px="24px" pt="24px" mb="8px">
        <Text bold fontSize="12px" color="secondary">
          #
        </Text>
        <Text bold fontSize="12px" color="secondary" textTransform="uppercase">
          {t('Date')}
        </Text>
        <Text bold fontSize="12px" color="secondary" textTransform="uppercase">
          {t('Your Tickets')}
        </Text>
        <Box width="20px" />
      </Grid>
      <Flex px="24px" pb="24px" flexDirection="column" overflowY="scroll" height="240px">
        {userLotteryData &&
          sortedByRoundId.map((finishedRound) => (
            <FinishedRoundRow
              key={finishedRound.lotteryId}
              roundId={finishedRound.lotteryId}
              hasWon={finishedRound.claimed}
              numberTickets={finishedRound.totalTickets}
              endTime={finishedRound.endTime}
              onClick={handleHistoryRowClick}
            />
          ))}
      </Flex>
    </>
  )
}

export default FinishedRoundTable
