import { isAxiosError, AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';

// Max limit of assets per one API request.
export const assetsLimit = 2000;

// Type of asset from assets service.
export interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

// Get list of assets from CoinCap API.
export async function getAssets(offset = 0, limit: number = assetsLimit): Promise<Asset[]> {
  let assets: Asset[] = [];

  try {
    const response: AxiosResponse<{ data: Asset[] }> = await api.get(`assets?limit=${limit}&offset=${offset}`);

    assets = response.data.data || [];
  } catch (error) {
    Notify.create({
      message: !isAxiosError(error)
        ? 'An unexpected error occurred'
        : error.message,
    });
  }

  return assets;
}

// Subscribe to assets price changes from CoinCap API.
export function subscribeToAssetPriceChanges(callback: (id: string, priceUsd: string) => void): void {
  const socket: WebSocket = new WebSocket('wss://ws.coincap.io/prices?assets=ALL');

  socket.onmessage = (message: MessageEvent): void => {
    try {
      const changes: { [key: string]: string } = JSON.parse(message.data);

      // Execute callback on every asset price change.
      Object.keys(changes).forEach((id: string): void => {
        callback(id, changes[id]);
      });
    } catch (error) {
      Notify.create({
        message: !isAxiosError(error)
          ? 'An unexpected error occurred'
          : error.message,
      });
    }
  };
}
