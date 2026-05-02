"use client";

import { useState, useMemo } from 'react';
import { SectionData } from '../../types/nhl';
import keybankData from '../data/keybank_map_data.json';

interface ArenaMapProps {
  sections?: SectionData[];
  currency: 'usd' | 'cad';
}

export function ArenaMap({ sections = [], currency }: ArenaMapProps) {
  const [hoveredSection, setHoveredSection] = useState<SectionData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent, sectionId: string) => {
    const match = sectionId.match(/\d+/);
    if (!match) return;

    const section = sections.find(s => s.id === `sec-${match[0]}`);
    if (section) {
      setHoveredSection(section);
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const formatPrice = (price: number, curr: 'usd' | 'cad') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.toUpperCase(),
    }).format(price);
  };

  const { minPrice, maxPrice } = useMemo(() => {
    if (!sections.length) return { minPrice: 0, maxPrice: 0 };
    const prices = sections.map(s => s.averagePrice.usd);
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [sections]);

  const getFillColor = (sectionId: string) => {
    const match = sectionId.match(/\d+/);
    if (!match) return "rgba(156, 163, 175, 0.1)";

    const section = sections.find(s => s.id === `sec-${match[0]}`);
    if (!section) return "rgba(156, 163, 175, 0.1)";

    const price = section.averagePrice.usd;
    const normalized = (price - minPrice) / (maxPrice - minPrice || 1);
    const hue = (1 - normalized) * 120;
    return `hsla(${hue}, 80%, 50%, 0.6)`;
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center p-4">

      {/* Legend */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
        <span>Cheapest Tickets</span>
        <div className="flex-1 h-3 mx-4 rounded-full" style={{ background: 'linear-gradient(to right, hsla(120, 80%, 50%, 0.6), hsla(60, 80%, 50%, 0.6), hsla(0, 80%, 50%, 0.6))' }}></div>
        <span>Most Expensive</span>
      </div>

      {/* Actual Layout KeyBank Center SVG Map */}
      <svg
        viewBox={keybankData.viewBox}
        className="w-full max-w-2xl drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(90deg)" }}
      >
        <g>
            {keybankData.sections.map((section) => (
              <path
                key={section.id}
                d={section.d}
                fill={getFillColor(section.id)}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-125 hover:stroke-gray-800 hover:stroke-[1px]"
                onMouseMove={(e) => handleMouseMove(e, section.id)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredSection && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-15px] border border-gray-700"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <p className="font-bold text-base mb-1 text-blue-300">{hoveredSection.name}</p>
          <p className="text-sm text-gray-300">
            Avg Price: <span className="text-white font-bold">{formatPrice(hoveredSection.averagePrice[currency], currency)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
