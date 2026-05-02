"use client";

import { useState, useMemo } from 'react';
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

  // Pre-calculate min and max prices to generate a heatmap color scale
  const { minPrice, maxPrice } = useMemo(() => {
    if (!sections.length) return { minPrice: 0, maxPrice: 0 };
    const prices = sections.map(s => s.averagePrice.usd);
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [sections]);

  // Helper to get fill color based on price heat map (Green = cheap, Red = expensive)
  const getFillColor = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return "rgba(156, 163, 175, 0.1)"; // Default gray if no data

    const price = section.averagePrice.usd;

    // Normalize price between 0 and 1
    const normalized = (price - minPrice) / (maxPrice - minPrice || 1);

    // Simple color interpolation from Green (cheap) to Red (expensive)
    // using HSL: 120 (Green) to 0 (Red)
    const hue = (1 - normalized) * 120;
    return `hsla(${hue}, 80%, 50%, 0.6)`;
  };

  // Helper to draw a pie slice / rounded wedge for stadium sections
  // cx, cy: center point
  // r1: inner radius, r2: outer radius
  // startAngle, endAngle: in degrees
  const getWedgePath = (cx: number, cy: number, r1: number, r2: number, startAngle: number, endAngle: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180.0;
    const endRad = (endAngle - 90) * Math.PI / 180.0;

    const x1_inner = cx + (r1 * Math.cos(startRad));
    const y1_inner = cy + (r1 * Math.sin(startRad));
    const x2_inner = cx + (r1 * Math.cos(endRad));
    const y2_inner = cy + (r1 * Math.sin(endRad));

    const x1_outer = cx + (r2 * Math.cos(startRad));
    const y1_outer = cy + (r2 * Math.sin(startRad));
    const x2_outer = cx + (r2 * Math.cos(endRad));
    const y2_outer = cy + (r2 * Math.sin(endRad));

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${x1_inner} ${y1_inner}`,
      `A ${r1} ${r1} 0 ${largeArcFlag} 1 ${x2_inner} ${y2_inner}`, // Inner arc
      `L ${x2_outer} ${y2_outer}`, // Line to outer radius
      `A ${r2} ${r2} 0 ${largeArcFlag} 0 ${x1_outer} ${y1_outer}`, // Outer arc (drawn backward)
      `Z` // Close path
    ].join(" ");
  };

  // Helper to generate an array of paths for a given level
  const renderLevelWedges = (levelPrefix: number, numSections: number, innerRadius: number, outerRadius: number) => {
    const wedges = [];
    const angleStep = 360 / numSections;

    for (let i = 0; i < numSections; i++) {
      const sectionNumber = i + 1;
      const sectionId = `sec-${levelPrefix}${sectionNumber.toString().padStart(2, '0')}`;

      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;

      // Add a tiny gap between sections
      const path = getWedgePath(400, 300, innerRadius, outerRadius, startAngle + 1, endAngle - 1);

      wedges.push(
        <path
          key={sectionId}
          d={path}
          fill={getFillColor(sectionId)}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200 hover:brightness-125"
          onMouseMove={(e) => handleMouseMove(e, sectionId)}
          onMouseLeave={handleMouseLeave}
        />
      );
    }
    return wedges;
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center p-4">

      {/* Legend */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
        <span>Cheapest Tickets</span>
        <div className="flex-1 h-3 mx-4 rounded-full" style={{ background: 'linear-gradient(to right, hsla(120, 80%, 50%, 0.6), hsla(60, 80%, 50%, 0.6), hsla(0, 80%, 50%, 0.6))' }}></div>
        <span>Most Expensive</span>
      </div>

      {/* Highly Detailed Circular Hockey Arena SVG Map */}
      <svg
        viewBox="0 0 800 600"
        className="w-full max-w-2xl drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ice Rink (Background / Core) */}
        <circle cx="400" cy="300" r="100" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />

        {/* Ice Rink Markings */}
        <line x1="300" y1="300" x2="500" y2="300" stroke="#ef4444" strokeWidth="3" /> {/* Center line */}
        <circle cx="400" cy="300" r="20" fill="none" stroke="#3b82f6" strokeWidth="3" />
        <line x1="330" y1="228" x2="330" y2="372" stroke="#3b82f6" strokeWidth="3" /> {/* Blue line 1 */}
        <line x1="470" y1="228" x2="470" y2="372" stroke="#3b82f6" strokeWidth="3" /> {/* Blue line 2 */}

        {/* 100 Level (12 sections, radius 100 to 160) */}
        {renderLevelWedges(1, 12, 105, 160)}

        {/* 200 Level (16 sections, radius 160 to 220) */}
        {renderLevelWedges(2, 16, 165, 220)}

        {/* 300 Level (20 sections, radius 220 to 280) */}
        {renderLevelWedges(3, 20, 225, 280)}

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
