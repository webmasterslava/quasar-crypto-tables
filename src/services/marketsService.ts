import { isAxiosError, AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';

// Max limit of asset markets per one API request.
export const marketsLimit = 2000;

// Type of asset market from markets service.
export interface Market {
  exchangeId: string;
  baseId: string;
  quoteId: string;
  baseSymbol: string;
  quoteSymbol: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  volumePercent: string;
}

// Get list of asset markets from CoinCap API.
export async function getMarkets(assetId: string, offset = 0, limit: number = marketsLimit): Promise<Market[]> {
  let markets: Market[] = [];

  try {
    const { data }: AxiosResponse<{ data: Market[] }> = await api.get(`assets/${assetId}/markets?limit=${limit}&offset=${offset}`);

    markets = data.data || [];
  } catch (error) {
    Notify.create({
      message: !isAxiosError(error)
        ? 'An unexpected error occurred'
        : error.message,
    });
  }

  return markets;
}
