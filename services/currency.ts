import { PriceObject } from '../types/nhl';

// MOCK: In the future, this should fetch from ExchangeRate-API
const MOCK_USD_TO_CAD_RATE = 1.35;
const MOCK_CAD_TO_USD_RATE = 1 / MOCK_USD_TO_CAD_RATE;

export async function getUsdToCadRate(): Promise<number> {
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_USD_TO_CAD_RATE;
}

export async function getCadToUsdRate(): Promise<number> {
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_CAD_TO_USD_RATE;
}

export async function convertUsdToPriceObject(usdAmount: number): Promise<PriceObject> {
  const rate = await getUsdToCadRate();
  return {
    usd: Number(usdAmount.toFixed(2)),
    cad: Number((usdAmount * rate).toFixed(2))
  };
}

export async function convertCadToPriceObject(cadAmount: number): Promise<PriceObject> {
  const rate = await getCadToUsdRate();
  return {
    usd: Number((cadAmount * rate).toFixed(2)),
    cad: Number(cadAmount.toFixed(2))
  };
}
