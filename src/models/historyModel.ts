import {
  getHistory as getHistoryFromService,
  HistoryPoint as HistoryPointFromService,
} from '../services/historyService';

// Type of history point from history model.
export interface HistoryPoint {
  priceUsd: number;
  time: number;
}

// Hash type with asset ID as key and list of asset history points as value.
export interface HistoryHash {
  [key: string]: HistoryPoint[];
}

// Get list of asset history points from history service.
export async function getHistory(assetId: string): Promise<HistoryPoint[]> {
  const historyFromService: HistoryPointFromService[] = await getHistoryFromService(assetId);

  const history: HistoryPoint[] = historyFromService.map(
    (historyPointFromService: HistoryPointFromService): HistoryPoint => ({
      priceUsd: +historyPointFromService.priceUsd,
      time: historyPointFromService.time,
    }),
  );

  return history;
}
