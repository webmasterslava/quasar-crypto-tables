import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { getMarkets, Market, MarketsHash } from '../models/marketsModel';
import { Store, StoreDefinition } from '../stores';

// Cache of loaded assets markets.
const cache: MarketsHash = {};

// Type of asset markets store.
export interface MarketsStoreSetup {
  markets: Ref<Market[]>;
  ensureMarkets: (assetId: string) => Promise<void>;
}

export type MarketsStore = Store<'markets', MarketsStoreSetup>;

// Initialize asset markets store.
export const useMarketsStore: StoreDefinition<'markets', MarketsStoreSetup> = defineStore('markets', (): MarketsStoreSetup => {
  // List of asset markets.
  const markets: Ref<Market[]> = ref([]);

  // Ensure that corresponding asset markets are loaded.
  async function ensureMarkets(assetId: string): Promise<void> {
    markets.value = [];

    if (!cache[assetId]) {
      // Get list of asset markets from markets service.
      cache[assetId] = await getMarkets(assetId);
    }

    markets.value = cache[assetId];
  }

  return {
    markets,
    ensureMarkets,
  };
});
