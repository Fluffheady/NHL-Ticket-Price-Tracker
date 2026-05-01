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

    // Example 2: Sabres vs. Rangers (potentially better deal score)
    const game2LowestUsd = 40;
    const game2AvgUsd = 150;
    const game2HighestUsd = 400;

    // Example 3: Canucks vs. Oilers
    const game3LowestUsd = 80;
    const game3AvgUsd = 180;
    const game3HighestUsd = 600;

    return [
      {
        id: 'sg-1',
        awayTeam: 'Toronto Maple Leafs',
        homeTeam: 'Boston Bruins',
        arena: 'TD Garden',
        date: date || new Date().toISOString(),
        lowestPrice: await convertUsdToPriceObject(game1LowestUsd),
        averagePrice: await convertUsdToPriceObject(game1AvgUsd),
        highestPrice: await convertUsdToPriceObject(game1HighestUsd),
      },
      {
        id: 'sg-2',
        awayTeam: 'New York Rangers',
        homeTeam: 'Buffalo Sabres',
        arena: 'KeyBank Center',
        date: date || new Date().toISOString(),
        lowestPrice: await convertUsdToPriceObject(game2LowestUsd),
        averagePrice: await convertUsdToPriceObject(game2AvgUsd),
        highestPrice: await convertUsdToPriceObject(game2HighestUsd),
      },
      {
        id: 'sg-3',
        awayTeam: 'Edmonton Oilers',
        homeTeam: 'Vancouver Canucks',
        arena: 'Rogers Arena',
        date: date || new Date().toISOString(),
        lowestPrice: await convertUsdToPriceObject(game3LowestUsd),
        averagePrice: await convertUsdToPriceObject(game3AvgUsd),
        highestPrice: await convertUsdToPriceObject(game3HighestUsd),
      }
    ];
  }
}
