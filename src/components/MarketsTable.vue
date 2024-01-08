<template>
  <!-- Asset markets table. -->
  <q-table
    v-model:pagination="pagination"
    binary-state-sort
    :columns="columns"
    :loading="loading"
    :rows="markets"
    :row-key="row => `${row.exchange}|${row.pair}`"
    :rows-per-page-options="[]"
  />
</template>

<script setup lang="ts">
import { syncRouteAndPagination } from 'components/pagination';
import { StoreToRefs, storeToRefs } from 'pinia';
import { QTableProps } from 'quasar';
import { useMarketsStore, MarketsStore } from 'stores/marketsStore';
import {
  ref, toRefs, watchEffect, Ref, ToRefs,
} from 'vue';
import {
  useRoute, useRouter, Route, Router,
} from 'vue-router';
import { Market } from '../models/marketsModel';
import { decimalWithSeparator } from '../utils/format';

// Incoming prop types.
interface Props {
  assetId: string;
}

// Get incoming asset ID prop.
const props: Props = defineProps<Props>();
const { assetId }: ToRefs<Props> = toRefs(props);

// Get markets store state and actions.
const marketsStore: MarketsStore = useMarketsStore();
const { markets }: StoreToRefs<MarketsStore> = storeToRefs(marketsStore);
const { ensureMarkets } = marketsStore;

// Data loading state.
const loading: Ref<boolean> = ref(true);

// List of markets table columns.
const columns: QTableProps['columns'] = [
  {
    name: 'exchange',
    label: 'Exchange',
    field: 'exchangeId',
    align: 'left',
    sortable: true,
  },
  {
    name: 'pair',
    label: 'Pair',
    field: (row: Market): string => `${row.baseSymbol}/${row.quoteSymbol}`,
  },
  {
    name: 'price',
    label: 'Price',
    field: 'priceUsd',
    format: (priceUsd: number): string => `$${decimalWithSeparator(priceUsd)}`,
    sortable: true,
  },
  {
    name: 'volume',
    label: 'Volume (24Hr)',
    field: 'volumeUsd24Hr',
    format: (volume: number): string => `$${decimalWithSeparator(volume)}`,
    sortable: true,
  },
  {
    name: 'volume2',
    label: 'Volume (%)',
    field: 'volumePercent',
    format: (volume2: number): string => `${decimalWithSeparator(volume2)}%`,
    sortable: true,
  },
];

// Initial pagination settings for markets table.
const pagination: Ref<QTableProps['pagination']> = ref({
  page: 1,
  sortBy: 'volume',
  descending: true,
  rowsPerPage: 20,
});

// Get router and page route.
const route: Route = useRoute();
const router: Router = useRouter();

// Synchronize URL query params with crypto table pagination and vice versa.
syncRouteAndPagination(route, router, pagination);

// Watch for URL changes and ensure that corresponding asset markets are loaded.
watchEffect(async (): Promise<void> => {
  await ensureMarkets(assetId.value);
  loading.value = false;
});
</script>
