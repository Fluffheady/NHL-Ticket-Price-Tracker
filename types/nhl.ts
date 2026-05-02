export interface PriceObject {
  usd: number;
  cad: number;
}

export interface SectionData {
  id: string; // e.g., '101', 'lower-bowl', 'upper-bowl'
  name: string; // Display name
  averagePrice: PriceObject;
}

export interface NHLGame {
  id: string;
  awayTeam: string;
  homeTeam: string;
  arena: string;
  date: string; // ISO 8601 string or similar
  lowestPrice: PriceObject;
  lowestPriceSection?: string; // Where the cheapest ticket is located
  averagePrice: PriceObject;
  highestPrice: PriceObject;
  sections?: SectionData[]; // Detailed section pricing
}

export interface TicketProvider {
  getGames(date?: string): Promise<NHLGame[]>;
}
