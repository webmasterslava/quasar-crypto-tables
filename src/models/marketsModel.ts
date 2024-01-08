import {
  marketsLimit,
  getMarkets as getMarketsFromService,
  Market as MarketFromService,
} from '../services/marketsService';

// Type of asset market from markets model.
export interface Market {
  exchangeId: string;
  baseId: string;
  quoteId: string;
  baseSymbol: string;
  quoteSymbol: string;
  priceUsd: number;
  volumeUsd24Hr: number;
  volumePercent: number;
}

// Hash type with asset ID as key and list of asset markets as value.
export interface MarketsHash {
  [key: string]: Market[];
}

// Get whole list of asset markets from markets service.
export async function getMarkets(assetId: string): Promise<Market[]> {
  let markets: Market[] = [];

  // Recursive request to markets service.
  async function handleRecursive(offset = 0): Promise<void> {
    const marketsFromService: MarketFromService[] = await getMarketsFromService(assetId, offset);

    markets = markets.concat(
      marketsFromService.map(
        (marketFromService: MarketFromService): Market => ({
          exchangeId: marketFromService.exchangeId,
          baseId: marketFromService.baseId,
          quoteId: marketFromService.quoteId,
          baseSymbol: marketFromService.baseSymbol,
          quoteSymbol: marketFromService.quoteSymbol,
          priceUsd: +marketFromService.priceUsd,
          volumeUsd24Hr: +marketFromService.volumeUsd24Hr,
          volumePercent: +marketFromService.volumePercent,
        }),
      ),
    );

    // Check if need to retrieve more markets.
    if (marketsFromService.length === marketsLimit) {
      await handleRecursive(offset + marketsLimit);
    }
  }

  // Initial recursive request.
  await handleRecursive();

  return markets;
}
