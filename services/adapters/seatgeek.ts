import { NHLGame, TicketProvider } from '../../types/nhl';
import { convertUsdToPriceObject } from '../currency';

export class SeatGeekAdapter implements TicketProvider {
  // Helper to dynamically generate section data
  private async generateDetailedSections(basePrice: number) {
    const sections = [];

    // 100 Level (12 sections, highly variable, most expensive)
    for (let i = 1; i <= 12; i++) {
      // Sections near center ice (3, 4, 9, 10) are pricier
      const multiplier = [3, 4, 9, 10].includes(i) ? 2.5 : 1.8;
      const price = basePrice * multiplier + (Math.random() * 50 - 25);
      sections.push({
        id: `sec-1${i.toString().padStart(2, '0')}`,
        name: `Section 1${i.toString().padStart(2, '0')}`,
        averagePrice: await convertUsdToPriceObject(Math.max(50, price))
      });
    }

    // 200 Level (16 sections, mid-range)
    for (let i = 1; i <= 16; i++) {
      const multiplier = [4, 5, 12, 13].includes(i) ? 1.5 : 1.2;
      const price = basePrice * multiplier + (Math.random() * 30 - 15);
      sections.push({
        id: `sec-2${i.toString().padStart(2, '0')}`,
        name: `Section 2${i.toString().padStart(2, '0')}`,
        averagePrice: await convertUsdToPriceObject(Math.max(40, price))
      });
    }

    // 300 Level (20 sections, cheapest)
    for (let i = 1; i <= 20; i++) {
      const multiplier = [5, 6, 15, 16].includes(i) ? 0.8 : 0.5;
      const price = basePrice * multiplier + (Math.random() * 20 - 10);
      sections.push({
        id: `sec-3${i.toString().padStart(2, '0')}`,
        name: `Section 3${i.toString().padStart(2, '0')}`,
        averagePrice: await convertUsdToPriceObject(Math.max(25, price))
      });
    }

    return sections;
  }

  async getGames(date?: string): Promise<NHLGame[]> {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For now, we mock the SeatGeek response with realistic dummy data.
    // In the future, this will use fetch() with SeatGeek API keys.

    // Example 1: Maple Leafs vs. Bruins
    const game1AvgUsd = 250;
    const game1Sections = await this.generateDetailedSections(game1AvgUsd);
    const game1Lowest = Math.min(...game1Sections.map(s => s.averagePrice.usd));
    const game1HighestUsd = 800;

    // Example 2: Sabres vs. Rangers (potentially better deal score)
    const game2AvgUsd = 150;
    const game2Sections = await this.generateDetailedSections(game2AvgUsd);
    const game2Lowest = Math.min(...game2Sections.map(s => s.averagePrice.usd));
    const game2HighestUsd = 400;

    // Example 3: Canucks vs. Oilers
    const game3AvgUsd = 180;
    const game3Sections = await this.generateDetailedSections(game3AvgUsd);
    const game3Lowest = Math.min(...game3Sections.map(s => s.averagePrice.usd));
    const game3HighestUsd = 600;

    return [
      {
        id: 'sg-1',
        awayTeam: 'Toronto Maple Leafs',
        homeTeam: 'Boston Bruins',
        arena: 'TD Garden',
        date: date || new Date().toISOString(),
        lowestPrice: await convertUsdToPriceObject(game1Lowest),
        lowestPriceSection: game1Sections.find(s => s.averagePrice.usd === game1Lowest)?.name,
        averagePrice: await convertUsdToPriceObject(game1AvgUsd),
        highestPrice: await convertUsdToPriceObject(game1HighestUsd),
        sections: game1Sections
      },
      {
        id: 'sg-2',
        awayTeam: 'New York Rangers',
        homeTeam: 'Buffalo Sabres',
        arena: 'KeyBank Center',
        date: date || new Date().toISOString(),
        lowestPrice: await convertUsdToPriceObject(game2Lowest),
        lowestPriceSection: game2Sections.find(s => s.averagePrice.usd === game2Lowest)?.name,
        averagePrice: await convertUsdToPriceObject(game2AvgUsd),
        highestPrice: await convertUsdToPriceObject(game2HighestUsd),
        sections: game2Sections
      },
      {
        id: 'sg-3',
        awayTeam: 'Edmonton Oilers',
        homeTeam: 'Vancouver Canucks',
        arena: 'Rogers Arena',
        date: date || new Date().toISOString(),
        lowestPrice: await convertUsdToPriceObject(game3Lowest),
        lowestPriceSection: game3Sections.find(s => s.averagePrice.usd === game3Lowest)?.name,
        averagePrice: await convertUsdToPriceObject(game3AvgUsd),
        highestPrice: await convertUsdToPriceObject(game3HighestUsd),
        sections: game3Sections
      }
    ];
  }
}
