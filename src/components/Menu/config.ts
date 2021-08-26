import { MenuEntry } from '@monetadex/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: t('Exchange'),
    icon: 'TradeIcon',
    href: '/swap',
  },
  {
    label: t('More'),
    icon: 'MoreIcon',
    items: [
      {
        label: t('Contact'),
        href: 'https://monetadex.gitbook.io/monetadex/contact-us',
      },
      {
        label: t('Github'),
        href: 'https://github.com/monetadex',
      },
    ],
  },
]

export default config
