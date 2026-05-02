"use client";

import { useState } from 'react';
import { SectionData } from '../../types/nhl';

interface ArenaMapProps {
  sections?: SectionData[];
  currency: 'usd' | 'cad';
}

export function ArenaMap({ sections = [], currency }: ArenaMapProps) {
  const [hoveredSection, setHoveredSection] = useState<SectionData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent, sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
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

  // Helper to get fill color based on whether data exists for this section
  const getFill = (sectionId: string) => {
    const hasData = sections.some(s => s.id === sectionId);
    return hasData ? "rgba(59, 130, 246, 0.2)" : "rgba(156, 163, 175, 0.1)"; // blue-500/20 vs gray-400/10
  };

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-4">
      {/* Generic Hockey Arena SVG Map */}
      <svg
        viewBox="0 0 800 600"
        className="w-full max-w-2xl drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ice Rink (Background) */}
        <rect x="200" y="150" width="400" height="300" rx="100" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />

        {/* Center Ice Lines */}
        <line x1="400" y1="150" x2="400" y2="450" stroke="#ef4444" strokeWidth="4" />
        <circle cx="400" cy="300" r="30" fill="none" stroke="#3b82f6" strokeWidth="4" />

        {/* Blue Lines */}
        <line x1="330" y1="150" x2="330" y2="450" stroke="#3b82f6" strokeWidth="4" />
        <line x1="470" y1="150" x2="470" y2="450" stroke="#3b82f6" strokeWidth="4" />

        {/* 100 Level (Lower Bowl) */}
        <path
          d="M 150,100 L 650,100 A 150,150 0 0,1 800,250 L 800,350 A 150,150 0 0,1 650,500 L 150,500 A 150,150 0 0,1 0,350 L 0,250 A 150,150 0 0,1 150,100 Z M 200,150 A 100,100 0 0,0 100,250 L 100,350 A 100,100 0 0,0 200,450 L 600,450 A 100,100 0 0,0 700,350 L 700,250 A 100,100 0 0,0 600,150 Z"
          fill={getFill('100-level')}
          stroke="#94a3b8"
          strokeWidth="2"
          className="cursor-pointer transition-colors duration-200 hover:fill-blue-500/40"
          onMouseMove={(e) => handleMouseMove(e, '100-level')}
          onMouseLeave={handleMouseLeave}
        />

        {/* 200 Level (Club Level) */}
        <path
          d="M 100,50 L 700,50 A 200,200 0 0,1 900,250 L 900,350 A 200,200 0 0,1 700,550 L 100,550 A 200,200 0 0,1 -100,350 L -100,250 A 200,200 0 0,1 100,50 Z M 150,100 A 150,150 0 0,0 0,250 L 0,350 A 150,150 0 0,0 150,500 L 650,500 A 150,150 0 0,0 800,350 L 800,250 A 150,150 0 0,0 650,100 Z"
          fill={getFill('200-level')}
          stroke="#cbd5e1"
          strokeWidth="2"
          className="cursor-pointer transition-colors duration-200 hover:fill-blue-500/40"
          onMouseMove={(e) => handleMouseMove(e, '200-level')}
          onMouseLeave={handleMouseLeave}
        />

        {/* 300 Level (Upper Bowl) */}
        <path
          d="M 50,0 L 750,0 A 250,250 0 0,1 1000,250 L 1000,350 A 250,250 0 0,1 750,600 L 50,600 A 250,250 0 0,1 -200,350 L -200,250 A 250,250 0 0,1 50,0 Z M 100,50 A 200,200 0 0,0 -100,250 L -100,350 A 200,200 0 0,0 100,550 L 700,550 A 200,200 0 0,0 900,350 L 900,250 A 200,200 0 0,0 700,50 Z"
          fill={getFill('300-level')}
          stroke="#e2e8f0"
          strokeWidth="2"
          className="cursor-pointer transition-colors duration-200 hover:fill-blue-500/40"
          onMouseMove={(e) => handleMouseMove(e, '300-level')}
          onMouseLeave={handleMouseLeave}
        />

        {/* Labels */}
        <text x="400" y="125" textAnchor="middle" fill="#475569" className="text-sm font-semibold pointer-events-none">100 Level</text>
        <text x="400" y="75" textAnchor="middle" fill="#64748b" className="text-sm font-semibold pointer-events-none">200 Level</text>
        <text x="400" y="25" textAnchor="middle" fill="#94a3b8" className="text-sm font-semibold pointer-events-none">300 Level</text>

      </svg>

      {/* Tooltip */}
      {hoveredSection && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px]"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <p className="font-bold text-sm mb-1">{hoveredSection.name}</p>
          <p className="text-sm text-gray-300">
            Avg Price: <span className="text-green-400 font-semibold">{formatPrice(hoveredSection.averagePrice[currency], currency)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
