import { defineStore } from 'pinia';
import {
  ref,
  computed,
  Ref,
  ComputedRef,
} from 'vue';
import dataAssets from '../data/assets.json';
import {
  getAssets,
  subscribeToAssetPriceChanges,
  Asset,
  AssetHash,
} from '../models/assetsModel';
import { Store, StoreDefinition } from '../stores';

// Flag that controls whether assets are loaded.
let assetsLoaded = false;

// Flag that controls whether subscribed to assets price changes.
let subscribedToAssetPriceChanges = false;

// Type of assets store.
export interface AssetsStoreSetup {
  assets: Ref<Asset[]>;
  assetsPerId: ComputedRef<AssetHash>;
  ensureAssets: () => Promise<void>;
  getAssetById: (id: string) => Asset | null;
  setAssetPriceById: (id: string, priceUsd: number) => void;
  ensureSubscribedToAssetPriceChanges: () => void;
}

export type AssetsStore = Store<'assets', AssetsStoreSetup>;

// Initialize assets store.
export const useAssetsStore: StoreDefinition<'assets', AssetsStoreSetup> = defineStore('assets', (): AssetsStoreSetup => {
  // List of assets.
  const assets: Ref<Asset[]> = ref(dataAssets as Asset[]);

  // Hash with asset ID as key and corresponding asset as value.
  const assetsPerId: ComputedRef<AssetHash> = computed(
    (): AssetHash => assets.value.reduce(
      (acc: AssetHash, asset: Asset) => ({ ...acc, [asset.id]: asset }),
      {},
    ),
  );

  // Ensure that assets are loaded.
  async function ensureAssets(): Promise<void> {
    if (!assetsLoaded) {
      assets.value = await getAssets();
      assetsLoaded = true;
    }
  }

  // Get asset by ID if exists.
  function getAssetById(name: string): Asset | null {
    return assetsPerId.value[name] || null;
  }

  // Set asset price by ID if exists.
  function setAssetPriceById(id: string, priceUsd: number): void {
    const asset: Asset | null = getAssetById(id);

    if (asset) {
      asset.priceUsd = priceUsd;
    }
  }

  // Ensure that subscribed to assets price changes.
  function ensureSubscribedToAssetPriceChanges(this: AssetsStore): void {
    if (!subscribedToAssetPriceChanges) {
      subscribeToAssetPriceChanges(this.setAssetPriceById);
      subscribedToAssetPriceChanges = true;
    }
  }

  return {
    assets,
    assetsPerId,
    ensureAssets,
    getAssetById,
    setAssetPriceById,
    ensureSubscribedToAssetPriceChanges,
  };
});
