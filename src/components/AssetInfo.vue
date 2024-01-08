<template>
  <q-card>
    <q-card-section>
      <!-- Asset info block. -->
      <div
        v-if="asset"
        class="row items-center justify-center"
      >
        <!-- Asset rank. -->
        <q-icon
          class="rank text-positive"
          name="fa-solid fa-bookmark"
        >
          <span class="text-white">{{ asset.rank }}</span>
        </q-icon>
        <!-- Asset icon. -->
        <img
          class="asset-icon q-ml-md"
          :src="`https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
        />
        <!-- Asset name and symbol. -->
        <div class="column q-ml-sm">
          <div class="text-h6">{{ asset.name }}</div>
          <div class="text-subtitle2 text-grey">{{ asset.symbol }}</div>
        </div>
        <q-space />
        <!-- Asset info column #1. -->
        <div class="row q-mx-md q-my-md">
          <div class="column">
            <div>Price:</div>
            <div>Market Cap:</div>
            <div>VWAP (24Hr):</div>
          </div>
          <div class="column q-ml-sm">
            <div class="text-bold">{{ `$${decimalWithSeparator(asset.priceUsd, 2)}` }}</div>
            <div class="text-bold">{{ `$${decimalWithSeparator(asset.marketCapUsd, 0)}` }}</div>
            <div class="text-bold">{{ `$${decimalWithSeparator(asset.vwap24Hr, 2)}` }}</div>
          </div>
        </div>
        <!-- Asset info column #2. -->
        <div class="row q-mx-md q-my-md">
          <div class="column">
            <div>Supply:</div>
            <div>Volume (24Hr):</div>
            <div>Change (24Hr):</div>
          </div>
          <div class="column q-ml-sm">
            <div class="text-bold">{{ decimalWithSeparator(asset.supply, 0) }}</div>
            <div class="text-bold">{{ `$${decimalWithSeparator(asset.volumeUsd24Hr, 0)}` }}</div>
            <!-- Colorized asset change cell. -->
            <div
              class="text-bold"
              :class="{
                'text-positive': asset.changePercent24Hr > 0,
                'text-negative': asset.changePercent24Hr < 0,
              }"
            >
              {{ `${decimalWithSeparator(asset.changePercent24Hr, 2)}` }}%
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useAssetsStore, AssetsStore } from 'stores/assetsStore';
import {
  ref, computed, toRefs, onMounted, Ref, ComputedRef, ToRefs,
} from 'vue';
import { Asset } from '../models/assetsModel';
import { decimalWithSeparator } from '../utils/format';

// Incoming prop types.
interface Props {
  assetId: string;
}

// Get incoming asset ID prop.
const props: Props = defineProps<Props>();
const { assetId }: ToRefs<Props> = toRefs(props);

// Get assets store actions.
const assetsStore: AssetsStore = useAssetsStore();
const { getAssetById, ensureAssets } = assetsStore;

// Data loading state.
const loading: Ref<boolean> = ref(true);

// Get asset object by ID.
const asset: ComputedRef<Asset | null> = computed((): Asset | null => getAssetById(assetId.value));

// Ensure that assets are loaded.
onMounted(async (): Promise<void> => {
  await ensureAssets();
  loading.value = false;
});
</script>

<style scoped lang="scss">
.rank {
  font-size: 100px;
  margin-top: -30px;

  span {
    font-size: 28px;
    margin-top: -18px;
    position: absolute;
  }
}
</style>
