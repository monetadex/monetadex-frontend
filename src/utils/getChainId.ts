import { filterPreferedNetwork } from './networkHelpers';

// Array of available nodes to connect to
// this needs to disapear and use the new ones
export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

const getChainId = () => {
  const preferednetwork = filterPreferedNetwork();
  return preferednetwork.chainId
}

export default getChainId
