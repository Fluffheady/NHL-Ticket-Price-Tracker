"use client";

import { useEffect, useState } from 'react';
import { NHLGame } from '../../types/nhl';
import { SeatGeekAdapter } from '../../services/adapters/seatgeek';
import { ExtremeMetrics } from '../components/ExtremeMetrics';
import { LeagueLeaderboard } from '../components/LeagueLeaderboard';

type Currency = 'usd' | 'cad';

export default function Home() {
  const [games, setGames] = useState<NHLGame[]>([]);
  const [currency, setCurrency] = useState<Currency>('usd');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      // In the future, this could be a generic ProviderManager that fetches from multiple providers
      const provider = new SeatGeekAdapter();
      const fetchedGames = await provider.getGames();
      setGames(fetchedGames);
      setLoading(false);
    }
    loadGames();
  }, []);

  const calculateDealScore = (average: number, lowest: number) => {
    if (average === 0) return 0;
    // Apply a 25% fee estimation to simulate realistic checkout costs
    const ESTIMATED_FEE_MULTIPLIER = 1.25;
    const lowestWithFees = lowest * ESTIMATED_FEE_MULTIPLIER;
    return (((average - lowestWithFees) / average) * 100).toFixed(1);
  };

  const formatPrice = (price: number, curr: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.toUpperCase(),
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-700 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-400">
              NHL Ice-Arbitrage
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Scalable League-Wide Analytics Platform
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
            <span className="text-sm font-medium">Currency:</span>
            <div className="flex bg-gray-100 dark:bg-zinc-900 rounded-md p-1">
              <button
                onClick={() => setCurrency('usd')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  currency === 'usd'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('cad')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  currency === 'cad'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                CAD
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Extreme Metrics Component */}
              <ExtremeMetrics games={games} currency={currency} />

              {/* League Leaderboard Component */}
              <LeagueLeaderboard games={games} currency={currency} />

              {/* Master Data Table */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <th className="px-6 py-4">Matchup</th>
                      <th className="px-6 py-4">Arena</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Avg Price</th>
                      <th className="px-6 py-4 text-right">Lowest Price</th>
                      <th className="px-6 py-4 text-right">Deal Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-700 text-sm">
                    {games.map((game) => {
                      const avg = game.averagePrice[currency];
                      const low = game.lowestPrice[currency];
                      const dealScore = calculateDealScore(avg, low);

                      return (
                        <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                            {game.awayTeam} @ {game.homeTeam}
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                            {game.arena}
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                            {new Date(game.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            {formatPrice(avg, currency)}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-green-600 dark:text-green-400">
                            {formatPrice(low, currency)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {dealScore}% OFF
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {games.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No games found.
                  </div>
                )}
              </div>
            </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
