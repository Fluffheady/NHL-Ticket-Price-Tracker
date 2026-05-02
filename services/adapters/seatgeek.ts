import { NHLGame, TicketProvider } from '../../types/nhl';
import { convertUsdToPriceObject } from '../currency';

export class SeatGeekAdapter implements TicketProvider {
  async getGames(date?: string): Promise<NHLGame[]> {
    // Simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For now, we mock the SeatGeek response with realistic dummy data.
    // In the future, this will use fetch() with SeatGeek API keys.

    // Example 1: Maple Leafs vs. Bruins
    const game1LowestUsd = 120;
    const game1AvgUsd = 250;
    const game1HighestUsd = 800;
    const game1Sections = [
      { id: '100-level', name: 'Lower Bowl (100s)', averagePrice: await convertUsdToPriceObject(450) },
      { id: '200-level', name: 'Club Level (200s)', averagePrice: await convertUsdToPriceObject(300) },
      { id: '300-level', name: 'Upper Bowl (300s)', averagePrice: await convertUsdToPriceObject(150) },
    ];

    // Example 2: Sabres vs. Rangers (potentially better deal score)
    const game2LowestUsd = 40;
    const game2AvgUsd = 150;
    const game2HighestUsd = 400;
    const game2Sections = [
      { id: '100-level', name: 'Lower Bowl (100s)', averagePrice: await convertUsdToPriceObject(220) },
      { id: '200-level', name: 'Club Level (200s)', averagePrice: await convertUsdToPriceObject(180) },
      { id: '300-level', name: 'Upper Bowl (300s)', averagePrice: await convertUsdToPriceObject(80) },
    ];

    // Example 3: Canucks vs. Oilers
    const game3LowestUsd = 80;
    const game3AvgUsd = 180;
    const game3HighestUsd = 600;
    const game3Sections = [
      { id: '100-level', name: 'Lower Bowl (100s)', averagePrice: await convertUsdToPriceObject(350) },
      { id: '200-level', name: 'Club Level (200s)', averagePrice: await convertUsdToPriceObject(250) },
      { id: '300-level', name: 'Upper Bowl (300s)', averagePrice: await convertUsdToPriceObject(110) },
    ];

    return [
      {
        id: 'sg-1',
        awayTeam: 'Toronto Maple Leafs',
        homeTeam: 'Boston Bruins',
        arena: 'TD Garden',
        date: date || new Date().toISOString(),
        lowestPrice: await convertUsdToPriceObject(game1LowestUsd),
        lowestPriceSection: 'Sec 310',
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
        lowestPrice: await convertUsdToPriceObject(game2LowestUsd),
        lowestPriceSection: 'Sec 305',
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
        lowestPrice: await convertUsdToPriceObject(game3LowestUsd),
        lowestPriceSection: 'Sec 321',
        averagePrice: await convertUsdToPriceObject(game3AvgUsd),
        highestPrice: await convertUsdToPriceObject(game3HighestUsd),
        sections: game3Sections
      }
    ];
  }
}
