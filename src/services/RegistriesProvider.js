import api from './ApiWrapper';
import TCR, { ContractsManager } from '../TCR';
import { updateLocalization } from '../i18n';
import Cache from '../utils/Cache';
import IPFS from './IPFS';

const TCRofTCRs = {
  'registry': '0x81e1269708582ae17560b6acc0f45d0416df8d68',
  'faucet': '0x94a2ecef046adf0a5a44fc80a0685b16a30b1170'
};
// require('../secrets.json').contracts;

const cache = new Cache(async (key) => {
  const item = await IPFS.get(key);
  item.registry = item.id;
  return item;
});

const get = async () => {
  const listings = await api.getListings(TCRofTCRs.registry);
  let registries = await Promise.all(
    listings.map(async (item) => {
      let registry = await cache.get(item.listing);
      return registry;
    })
  );
  return registries.sort((a, b) => {
    return a.id > b.id ? 1 : -1;
  });
};

const getLocalization = async (registryAddress) => {
  try {
    const registry = await cache.get(registryAddress);
    return registry.localization;
  } catch (err) {
    console.error(err);
  }
  return '';
};

const switchTo = async (registryAddress) => {
  if (TCR.registry() && TCR.registry().address === registryAddress) {
    return;
  }
  let contracts = await get();
  ContractsManager.setRegistries(contracts);
  let addresses = ContractsManager.getRegistriesAddresses();
  let address = addresses[0];
  if (registryAddress && ContractsManager.hasRegistry(registryAddress)) {
    address = registryAddress;
  }
  ContractsManager.selectRegistry(address);
  let localization = await getLocalization(address);
  updateLocalization(localization);
};

export default {
  get,
  switchTo
};
