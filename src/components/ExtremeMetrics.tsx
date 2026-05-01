import React from 'react';
import { NHLGame } from '../../types/nhl';

interface ExtremeMetricsProps {
  games: NHLGame[];
  currency: 'usd' | 'cad';
}

export const ExtremeMetrics: React.FC<ExtremeMetricsProps> = ({ games, currency }) => {
  if (games.length === 0) return null;

  // Calculate The Whale Watch (highest ticket price globally)
  const whaleWatchGame = [...games].sort((a, b) => b.highestPrice[currency] - a.highestPrice[currency])[0];
  const whalePrice = whaleWatchGame.highestPrice[currency];

  // Calculate The Floor Tracker (lowest ticket price globally)
  const floorTrackerGame = [...games].sort((a, b) => a.lowestPrice[currency] - b.lowestPrice[currency])[0];
  const floorPrice = floorTrackerGame.lowestPrice[currency];

  const formatPrice = (price: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.toUpperCase(),
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Whale Watch Card */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">🐋 The Whale Watch</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Highest active ticket price</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {whaleWatchGame.awayTeam} @ {whaleWatchGame.homeTeam}
            </p>
            <p className="text-xs text-gray-500">{new Date(whaleWatchGame.date).toLocaleDateString()}</p>
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400">
            {formatPrice(whalePrice, currency)}
          </div>
        </div>
      </div>

      {/* Floor Tracker Card */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">📉 The Floor Tracker</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Literal cheapest entry globally</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {floorTrackerGame.awayTeam} @ {floorTrackerGame.homeTeam}
            </p>
            <p className="text-xs text-gray-500">{new Date(floorTrackerGame.date).toLocaleDateString()}</p>
          </div>
          <div className="text-2xl font-black text-green-600 dark:text-green-400">
            {formatPrice(floorPrice, currency)}
          </div>
        </div>
      </div>
    </div>
  );
};
