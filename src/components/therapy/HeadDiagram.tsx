'use client';

import type { HeadArea } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface HeadDiagramProps {
  selectedAreas: HeadArea[];
  onChange: (selectedAreas: HeadArea[]) => void;
}

// Simplified representation of head areas
const areas: { id: HeadArea; label: string; path: string; viewBox?: string, transform?: string }[] = [
  { id: 'forehead', label: 'Forehead', path: 'M100,50 Q150,30 200,50 Q220,100 150,120 Q80,100 100,50 Z', transform: "translate(0, -10) scale(0.9)"},
  { id: 'temples', label: 'Temples (L)', path: 'M80,70 Q60,90 80,110 L95,105 Q75,85 95,75 Z', transform: "translate(-10,0) scale(0.9)" },
  { id: 'temples', label: 'Temples (R)', path: 'M220,70 Q240,90 220,110 L205,105 Q225,85 205,75 Z', transform: "translate(10,0) scale(0.9)" },
  { id: 'eyes', label: 'Eyes (L)', path: 'M110,75 A20,15 0 1,1 110,105 A20,15 0 1,1 110,75 Z', transform: "translate(-5, 0) scale(0.8)" },
  { id: 'eyes', label: 'Eyes (R)', path: 'M190,75 A20,15 0 1,1 190,105 A20,15 0 1,1 190,75 Z', transform: "translate(5, 0) scale(0.8)" },
  { id: 'back_of_head', label: 'Back of Head', path: 'M100,130 Q150,180 200,130 L180,120 Q150,150 120,120 Z', transform:"scale(1.1) translate(0,5)" },
  { id: 'top_of_head', label: 'Top of Head', path: 'M120,30 Q150,10 180,30 L170,40 Q150,25 130,40 Z', transform:"scale(1) translate(0,-15)"},
  { id: 'neck', label: 'Neck', path: 'M125,150 Q150,170 175,150 L160,160 Q150,165 140,160 Z', transform:"scale(1.2) translate(0,15)" },
];


export function HeadDiagram({ selectedAreas: initialSelectedAreas, onChange }: HeadDiagramProps) {
  const [selected, setSelected] = useState<HeadArea[]>(initialSelectedAreas);

  useEffect(() => {
    setSelected(initialSelectedAreas);
  }, [initialSelectedAreas]);
  
  const toggleArea = (areaId: HeadArea) => {
    const newSelected = selected.includes(areaId)
      ? selected.filter((id) => id !== areaId)
      : [...selected, areaId];
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" data-ai-hint="head outline">
        {/* Base head outline */}
        <path d="M150,20 C 80,20 60,80 80,140 C 90,180 120,200 150,200 C 180,200 210,180 220,140 C 240,80 220,20 150,20 Z" 
              fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2"/>
        
        {areas.map((area) => (
          <path
            key={`${area.id}-${area.label}`} // Ensure unique key if ids can repeat (e.g. temples)
            d={area.path}
            transform={area.transform}
            fill={selected.includes(area.id) ? 'hsl(var(--accent))' : 'hsl(var(--secondary))'}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            onClick={() => toggleArea(area.id)}
            className="cursor-pointer transition-colors duration-200 hover:opacity-80"
            aria-label={area.label}
          />
        ))}
      </svg>
      <div className="mt-2 text-sm text-center text-muted-foreground">
        Tap on affected areas. Selected: {selected.join(', ') || 'None'}
      </div>
    </div>
  );
}
