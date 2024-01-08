import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { getHistory, HistoryPoint, HistoryHash } from '../models/historyModel';
import { Store, StoreDefinition } from '../stores';

// Cache of loaded assets histoty data.
const cache: HistoryHash = {};

// Type of assets history store.
export interface HistoryStoreSetup {
  history: Ref<HistoryPoint[]>;
  ensureHistory: (assetId: string) => Promise<void>;
}

export type HistoryStore = Store<'history', HistoryStoreSetup>;

// Initialize asset history store.
export const useHistoryStore: StoreDefinition<'history', HistoryStoreSetup> = defineStore('history', (): HistoryStoreSetup => {
  // List of asset history points.
  const history: Ref<HistoryPoint[]> = ref([]);

  // Ensure that corresponding asset history is loaded.
  async function ensureHistory(assetId: string): Promise<void> {
    history.value = [];

    if (!cache[assetId]) {
      // Get list of asset history points from history service.
      cache[assetId] = await getHistory(assetId);
    }

    history.value = cache[assetId];
  }

  return {
    history,
    ensureHistory,
  };
});
