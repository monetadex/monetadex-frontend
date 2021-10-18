import { NetworkConfig } from '@monetadex/uikit';
import { filterPreferedNetwork } from './networkHelpers';

const getNetwork = () : NetworkConfig => {
  const preferednetwork = filterPreferedNetwork();
  return preferednetwork
}

export default getNetwork