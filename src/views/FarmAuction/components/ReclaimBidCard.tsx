import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex } from '@monetadex/uikit'
import { useTranslation } from 'contexts/Localization'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake, useFarmAuctionContract } from 'hooks/useContract'
import { ethersToBigNumber } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getBalanceNumber } from 'utils/formatBalance'
import { ethers } from 'ethers'
import ApproveConfirmButtons, { ButtonArrangement } from 'views/Profile/components/ApproveConfirmButtons'
import useReclaimAuctionBid from '../hooks/useReclaimAuctionBid'

const StyledReclaimBidCard = styled(Card)`
  margin-top: 16px;
  flex: 1;
`

const ReclaimBidCard: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const [reclaimableAuction, checkForNextReclaimableAuction] = useReclaimAuctionBid()

  const cakeContract = useCake()
  const farmAuctionContract = useFarmAuctionContract()

  const { toastSuccess } = useToast()

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        const response = await cakeContract.allowance(account, farmAuctionContract.address)
        const currentAllowance = ethersToBigNumber(response)
        return currentAllowance.gt(0)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return callWithGasPrice(cakeContract, 'approve', [farmAuctionContract.address, ethers.constants.MaxUint256])
    },
    onApproveSuccess: async () => {
      toastSuccess(t('Contract approved - you can now reclaim your bid!'))
    },
    onConfirm: () => {
      return callWithGasPrice(farmAuctionContract, 'claimAuction', [reclaimableAuction.id])
    },
    onSuccess: async () => {
      checkForNextReclaimableAuction()
      toastSuccess(t('Bid reclaimed!'))
    },
  })

  if (!reclaimableAuction) {
    return null
  }

  const { position, amount } = reclaimableAuction

  return (
    <StyledReclaimBidCard mb={['24px', null, null, '0']}>
      <CardHeader>
        <Heading>{t('Reclaim Bid')}</Heading>
      </CardHeader>
      <CardBody>
        <Text mb="16px">
          {t('Your bid in Auction #%auctionId% was unsuccessful.', { auctionId: reclaimableAuction.id })}
        </Text>
        <Text bold mb="16px">
          {t('Reclaim your CAKE now.')}
        </Text>
        <Flex justifyContent="space-between" mb="8px">
          <Text color="textSubtle">{t('Your total bid')}</Text>
          <Text>{t('%num% CAKE', { num: getBalanceNumber(amount).toLocaleString() })}</Text>
        </Flex>
        <Flex justifyContent="space-between" mb="24px">
          <Text color="textSubtle">{t('Your position')}</Text>
          <Text>#{position}</Text>
        </Flex>
        {account ? (
          <ApproveConfirmButtons
            isApproveDisabled={isApproved}
            isApproving={isApproving}
            isConfirmDisabled={false}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
            buttonArrangement={ButtonArrangement.SEQUENTIAL}
            confirmLabel={t('Reclaim')}
          />
        ) : (
          <ConnectWalletButton />
        )}
      </CardBody>
    </StyledReclaimBidCard>
  )
}

export default ReclaimBidCard
