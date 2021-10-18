import sample from 'lodash/sample'
import { filterPreferedNetwork } from './networkHelpers';

export const getNodes = () : string[] => {
  const preferednetwork = filterPreferedNetwork();
  return preferednetwork.rpcUrl
}

const getNodeUrl = () => {
  const preferednetwork = filterPreferedNetwork();
  return sample(preferednetwork.rpcUrl)
}

export default getNodeUrl
