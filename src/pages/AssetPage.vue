<template>
  <q-page>
    <!-- Asset info block. -->
    <asset-info :asset-id="assetId" />
    <!-- Asset history chart. -->
    <history-chart :asset-id="assetId" class="q-mt-lg" />
    <!-- Asset markets table. -->
    <markets-table :asset-id="assetId" class="q-mt-lg" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRoute, Route } from 'vue-router';
import AssetInfo from 'components/AssetInfo.vue';
import HistoryChart from 'components/HistoryChart.vue';
import MarketsTable from 'components/MarketsTable.vue';

// Get asset ID from URL.
const route: Route = useRoute();
const assetId: ComputedRef<string> = computed((): string => route.params.id as string);
</script>
