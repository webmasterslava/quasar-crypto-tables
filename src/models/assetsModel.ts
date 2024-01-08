import {
  assetsLimit,
  getAssets as getAssetsFromService,
  subscribeToAssetPriceChanges as subscribeToAssetPriceChangesFromService,
  Asset as AssetFromService,
} from '../services/assetsService';

// Type of asset from assets model.
export interface Asset {
  id: string;
  rank: number;
  symbol: string;
  name: string;
  supply: number;
  maxSupply: number;
  marketCapUsd: number;
  volumeUsd24Hr: number;
  priceUsd: number;
  changePercent24Hr: number;
  vwap24Hr: number;
}

// Hash type with asset ID as key and asset as value.
export interface AssetHash {
  [key: string]: Asset;
}

// Hash type with asset ID as key and list of assets as value.
export interface AssetsHash {
  [key: string]: Asset[];
}

// Get whole list of assets from assets service.
export async function getAssets(): Promise<Asset[]> {
  let assets: Asset[] = [];

  // Recursive request to assets service.
  async function handleRecursive(offset = 0): Promise<void> {
    const assetsFromService: AssetFromService[] = await getAssetsFromService(offset);

    assets = assets.concat(
      assetsFromService.map(
        (assetFromService: AssetFromService): Asset => ({
          id: assetFromService.id,
          rank: +assetFromService.rank,
          symbol: assetFromService.symbol,
          name: assetFromService.name,
          supply: +assetFromService.supply,
          maxSupply: +assetFromService.maxSupply,
          marketCapUsd: +assetFromService.marketCapUsd,
          volumeUsd24Hr: +assetFromService.volumeUsd24Hr,
          priceUsd: +assetFromService.priceUsd,
          changePercent24Hr: +assetFromService.changePercent24Hr,
          vwap24Hr: +assetFromService.vwap24Hr,
        }),
      ),
    );

    // Check if need to retrieve more assets.
    if (assetsFromService.length === assetsLimit) {
      await handleRecursive(offset + assetsLimit);
    }
  }

  // Initial recursive request.
  await handleRecursive();

  return assets;
}

// Subscribe to assets price changes from assets service.
export function subscribeToAssetPriceChanges(callback: (id: string, priceUsd: number) => void): void {
  subscribeToAssetPriceChangesFromService((id: string, priceUsd: string): void => {
    // Execute callback on every asset price change.
    callback(id, +priceUsd);
  });
}
