<template>
  <!-- Assets table. -->
  <q-table
    v-model:pagination="pagination"
    binary-state-sort
    :columns="columns"
    :loading="loading"
    :rows="assets"
    row-key="rank"
    :rows-per-page-options="[]"
  >
    <template v-slot:body="props">
      <!-- Asset row. -->
      <q-tr
        class="cursor-pointer"
        :class="{
           // Highlights of asset price changes.
          'highlight-green': highlights[props.row.id] === 1,
          'highlight-red': highlights[props.row.id] === -1,
        }"
        @click="rowClick(props.row)"
        :props="props"
      >
        <!-- Asset cells. -->
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          <template v-if="col.name === 'name'">
            <div class="row">
              <!-- Asset icon. -->
              <img
                class="asset-icon self-center"
                :src="`https://assets.coincap.io/assets/icons/${props.row.symbol.toLowerCase()}@2x.png`"
              />
              <!-- Asset name and symbol. -->
              <div class="column q-ml-xs">
                <div class="text-body2">{{ col.value }}</div>
                <div class="text-caption text-grey">{{ props.row.symbol }}</div>
              </div>
            </div>
          </template>
          <!-- Colorized asset change cell. -->
          <template v-else-if="col.name === 'change'">
            <div
              :class="{
                'text-positive': props.row.changePercent24Hr > 0,
                'text-negative': props.row.changePercent24Hr < 0,
              }"
            >
              {{ col.value }}
            </div>
          </template>
          <!-- Other asset cells. -->
          <template v-else>
            {{ col.value }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { syncRouteAndPagination } from 'components/pagination';
import { StoreToRefs, storeToRefs } from 'pinia';
import { QTable, QTableProps } from 'quasar';
import { useAssetsStore, AssetsStore } from 'stores/assetsStore';
import { ref, onMounted, Ref } from 'vue';
import {
  useRoute, useRouter, Route, Router,
} from 'vue-router';
import { Asset } from '../models/assetsModel';
import { decimalWithSeparator } from '../utils/format';

// Get assets store state and actions.
const assetsStore: AssetsStore = useAssetsStore();
const { assets }: StoreToRefs<AssetsStore> = storeToRefs(assetsStore);
const { getAssetById, ensureAssets, ensureSubscribedToAssetPriceChanges } = assetsStore;

// Data loading state.
const loading: Ref<boolean> = ref(true);

// List of crypto table columns.
const columns: QTableProps['columns'] = [
  {
    name: 'rank',
    label: 'Rank',
    field: 'rank',
    align: 'center',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'price',
    label: 'Price',
    field: 'priceUsd',
    sortable: true,
    format: (priceUsd: number): string => `$${decimalWithSeparator(priceUsd, 2)}`,
  },
  {
    name: 'marketCap',
    label: 'Market Cap',
    field: 'marketCapUsd',
    format: (marketCap: number): string => `$${decimalWithSeparator(marketCap, 0)}`,
    sortable: true,
  },
  {
    name: 'vwap',
    label: 'VWAP (24Hr)',
    field: 'vwap24Hr',
    format: (vwap: number): string => `$${decimalWithSeparator(vwap, 2)}`,
    sortable: true,
  },
  {
    name: 'supply',
    label: 'Supply',
    field: 'supply',
    format: (supply: number): string => decimalWithSeparator(supply, 0),
    sortable: true,
  },
  {
    name: 'volume',
    label: 'Volume (24Hr)',
    field: 'volumeUsd24Hr',
    format: (volume: number): string => `$${decimalWithSeparator(volume, 0)}`,
    sortable: true,
  },
  {
    name: 'change',
    label: 'Change (24Hr)',
    field: 'changePercent24Hr',
    format: (change: number): string => `${decimalWithSeparator(change, 2)}%`,
    sortable: true,
  },
];

// Initial pagination settings for crypto table.
const pagination: Ref<QTableProps['pagination']> = ref({
  page: 1,
  sortBy: 'rank',
  descending: false,
  rowsPerPage: 20,
});

// Get router and page route.
const route: Route = useRoute();
const router: Router = useRouter();

// Synchronize URL query params with crypto table pagination and vice versa.
syncRouteAndPagination(route, router, pagination);

// List of assets highlights.
const highlights: Ref<{ [name: string]: number }> = ref({});

// Watch for assets price changes and add corresponding hightlights.
assetsStore.$onAction(({ name, args }) => {
  if (name === 'setAssetPriceById') {
    const [id, priceUsd]: [string, number] = args;
    const asset: Asset | null = getAssetById(id);

    if (asset) {
      highlights.value[id] = priceUsd < asset.priceUsd
        ? -1
        : 1;

      setTimeout((): void => {
        highlights.value[id] = 0;
      }, 1);
    }
  }
});

// Handle click on asset row in the table, move to asset page.
function rowClick(asset: Asset) {
  router.push(`/assets/${asset.id}`);
}

// Ensure that assets are loaded and subscribed to assets price changes.
onMounted(async (): Promise<void> => {
  await ensureAssets();
  ensureSubscribedToAssetPriceChanges();

  loading.value = false;
});
</script>

<style scoped lang="scss">
.q-tr {
  transition: background-color 1s ease-out;
}
.highlight-green {
  background-color: rgba(24, 198, 131, 0.19);
  transition: none;
}
.highlight-red {
  background-color: rgba(244, 67, 54, 0.19);
  transition: none;
}
.asset-icon {
  height: 30px;
  width: 30px;
}
</style>
