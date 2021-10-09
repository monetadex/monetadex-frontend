import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'MonetaDex',
  description:
    'Exchange you coins, stake your tokens and provide liquidity at MonetaDex',
  image: 'https://monetadex.com/images/meta.png',
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
        title: `${t('Initial Farm Offering')} | ${t('MonetaDex')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('MonetaDex')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('MonetaDex')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('MonetaDex')}`,
      }
    default:
      return null
  }
}
