<template>
  <q-card>
    <q-card-section>
      <!-- Asset history chart. -->
      <ApexChart
        class="chart"
        :options="options"
        :series="series"
        type="area"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ApexOptions } from 'apexcharts';
import { StoreToRefs, storeToRefs } from 'pinia';
import { getCssVar } from 'quasar';
import { useHistoryStore, HistoryStore } from 'stores/historyStore';
import {
  ref, computed, toRefs, watchEffect, Ref, ComputedRef, ToRefs,
} from 'vue';
import ApexChart from 'vue3-apexcharts';
import { HistoryPoint } from '../models/historyModel';
import { decimalWithSeparator } from '../utils/format';

// Incoming prop types.
interface Props {
  assetId: string;
}

// Get incoming asset ID prop.
const props: Props = defineProps<Props>();
const { assetId }: ToRefs<Props> = toRefs(props);

// Get history store state and actions.
const historyStore: HistoryStore = useHistoryStore();
const { history }: StoreToRefs<HistoryStore> = storeToRefs(historyStore);
const { ensureHistory } = historyStore;

// Data loading state.
const loading: Ref<boolean> = ref(true);

// Apex area chart options.
const options: ComputedRef<ApexOptions> = computed((): ApexOptions => ({
  chart: {
    height: 500,
    type: 'area',
    // Auto-scale asset price axis on zoom.
    zoom: {
      autoScaleYaxis: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors: [
    getCssVar('primary'),
  ],
  stroke: {
    width: 2,
  },
  // Time axis.
  xaxis: {
    type: 'datetime',
    categories: history.value.map((historyPoint: HistoryPoint): number => historyPoint.time),
  },
  // Asset price axis.
  yaxis: {
    tickAmount: 8,
    labels: {
      formatter: (priceUsd: number): string => `$${decimalWithSeparator(priceUsd)}`,
    },
  },
  // Tooltip on mouse hover.
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
    y: {
      title: {
        formatter: (): string => '',
      },
    },
  },
}));

// History data for apex chart.
const series: ComputedRef<ApexOptions['series']> = computed((): ApexOptions['series'] => ([{
  data: history.value.map((historyPoint: HistoryPoint): number => historyPoint.priceUsd),
}]));

// Watch for URL changes and ensure that corresponding asset history is loaded.
watchEffect(async (): Promise<void> => {
  await ensureHistory(assetId.value);
  loading.value = false;
});
</script>
