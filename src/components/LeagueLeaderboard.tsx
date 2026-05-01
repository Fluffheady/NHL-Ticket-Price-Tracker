import React, { useMemo } from 'react';
import { NHLGame } from '../../types/nhl';

interface LeagueLeaderboardProps {
  games: NHLGame[];
  currency: 'usd' | 'cad';
}

interface TeamStats {
  team: string;
  totalAvgPrice: number;
  gameCount: number;
  overallAverage: number;
}

export const LeagueLeaderboard: React.FC<LeagueLeaderboardProps> = ({ games, currency }) => {
  const leaderboardData = useMemo(() => {
    if (games.length === 0) return [];

    const statsMap: Record<string, TeamStats> = {};

    games.forEach((game) => {
      // Calculate stats for home team
      if (!statsMap[game.homeTeam]) {
        statsMap[game.homeTeam] = { team: game.homeTeam, totalAvgPrice: 0, gameCount: 0, overallAverage: 0 };
      }
      statsMap[game.homeTeam].totalAvgPrice += game.averagePrice[currency];
      statsMap[game.homeTeam].gameCount += 1;

      // Calculate stats for away team
      if (!statsMap[game.awayTeam]) {
        statsMap[game.awayTeam] = { team: game.awayTeam, totalAvgPrice: 0, gameCount: 0, overallAverage: 0 };
      }
      statsMap[game.awayTeam].totalAvgPrice += game.averagePrice[currency];
      statsMap[game.awayTeam].gameCount += 1;
    });

    // Calculate overall average and sort
    const sortedStats = Object.values(statsMap)
      .map((stat) => {
        stat.overallAverage = stat.totalAvgPrice / stat.gameCount;
        return stat;
      })
      .sort((a, b) => b.overallAverage - a.overallAverage);

    return sortedStats;
  }, [games, currency]);

  if (leaderboardData.length === 0) return null;

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.toUpperCase(),
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">🏆 League Leaderboard</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Most to least expensive active ticket averages</p>
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
            <tr className="text-sm font-medium text-gray-500 dark:text-gray-400">
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Team</th>
              <th className="px-6 py-3 text-right">Avg Ticket Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700/50 text-sm">
            {leaderboardData.map((stat, index) => (
              <tr key={stat.team} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                <td className="px-6 py-3 font-medium text-gray-500">#{index + 1}</td>
                <td className="px-6 py-3 font-bold text-gray-900 dark:text-gray-100">{stat.team}</td>
                <td className="px-6 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                  {formatPrice(stat.overallAverage, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
