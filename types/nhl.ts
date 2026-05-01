export interface PriceObject {
  usd: number;
  cad: number;
}

export interface NHLGame {
  id: string;
  awayTeam: string;
  homeTeam: string;
  arena: string;
  date: string; // ISO 8601 string or similar
  lowestPrice: PriceObject;
  averagePrice: PriceObject;
  highestPrice: PriceObject;
}

export interface TicketProvider {
  getGames(date?: string): Promise<NHLGame[]>;
}
