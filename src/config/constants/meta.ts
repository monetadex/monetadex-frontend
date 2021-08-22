import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'MonetaDex',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('MonetaDex')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('MonetaDex')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('MonetaDex')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('MonetaDex')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('MonetaDex')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('MonetaDex')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('MonetaDex')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('PancakeSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('PancakeSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('PancakeSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('PancakeSwap')}`,
      }
    default:
      return null
  }
}
