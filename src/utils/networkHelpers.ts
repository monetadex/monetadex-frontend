import { NetworkConfig, networkLocalStorageKey, networks } from '@monetadex/uikit';

/**
 * Returns the prefered network or if it does not exists the first one of the sorted network array
 * @returns A preferred network, if found - or the first element of the network array
 */
export const filterPreferedNetwork = (): NetworkConfig => {
  const networkConfig: NetworkConfig = JSON.parse(localStorage.getItem(networkLocalStorageKey));
  const sortedConfig = networks.sort((a: NetworkConfig, b: NetworkConfig) => a.priority - b.priority);

  if (!networkConfig) {
    return sortedConfig[0];
  }


  return networkConfig
}

export default filterPreferedNetwork
