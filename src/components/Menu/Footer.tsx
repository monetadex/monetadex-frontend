import React from 'react'
import styled from 'styled-components'
import { Flex, Svg, Image, Button } from '@monetadex/uikit'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: space-between;
    flex-direction: row;
  }
`

const BubbleWrapper = styled(Flex)`
  margin-top: 30px;
  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
    transition: background-color 0.2s, opacity 0.2s;
  }
  &:hover {
    svg {
      opacity: 0.65;
    }
  }
  &:active {
    svg {
      opacity: 0.85;
    }
  }
`

const Footer = () => {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Flex
        flexGrow={1}
        alignItems="center"
        width={['100%', '100%', '100%', 'auto']}
        justifyContent={['center', 'center', 'center', 'flex-end']}
      >
        <BubbleWrapper>
          <Button
            id="clickExchangeHelp"
            as="a"
            external
            href="https://monetadex.gitbook.io/monetadex"
            variant="subtle"
          >
            {t('Need help ?')}
          </Button>
          <Svg viewBox="0 0 16 16">
            <path d="M0 16V0C0 0 3 1 6 1C9 1 16 -2 16 3.5C16 10.5 7.5 16 0 16Z" />
          </Svg>
        </BubbleWrapper>
        <Image src="/images/help.svg" alt="Get some help" width={160} height={108} />
      </Flex>
    </Wrapper>
  )
}

export default Footer
