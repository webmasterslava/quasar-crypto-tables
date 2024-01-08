import { isAxiosError, AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { Notify } from 'quasar';

// Type of asset history point from history service.
export interface HistoryPoint {
  priceUsd: string;
  time: number;
  date: string;
}

// Get list of asset history points from CoinCap API.
export async function getHistory(assetId: string): Promise<HistoryPoint[]> {
  let history: HistoryPoint[] = [];

  try {
    const { data }: AxiosResponse<{ data: HistoryPoint[] }> = await api.get(`assets/${assetId}/history?interval=d1`);

    history = data.data || [];
  } catch (error) {
    Notify.create({
      message: !isAxiosError(error)
        ? 'An unexpected error occurred'
        : error.message,
    });
  }

  return history;
}
