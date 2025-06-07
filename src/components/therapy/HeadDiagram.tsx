
'use client';

import type { HeadArea } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface HeadDiagramProps {
  selectedAreas: HeadArea[];
  onChange: (selectedAreas: HeadArea[]) => void;
}

// Simplified representation of head areas with corrected paths
const areas: { id: HeadArea; label: string; path: string; }[] = [
  { id: 'top_of_head', label: 'Top of Head', path: 'M125,20 Q150,10 175,20 L180,45 Q150,40 120,45 Z' },
  { id: 'forehead', label: 'Forehead', path: 'M100,48 L200,48 L195,78 L105,78 Z' },
  { id: 'temples', label: 'Temple (L)', path: 'M80,60 C60,70 55,110 75,120 L90,115 C75,100 75,80 90,65 Z' },
  { id: 'temples', label: 'Temple (R)', path: 'M220,60 C240,70 245,110 225,120 L210,115 C225,100 225,80 210,65 Z' },
  { id: 'eyes', label: 'Eye (L)', path: 'M110,82 A15,10 0 1,1 110,102 A15,10 0 1,1 110,82 Z' },
  { id: 'eyes', label: 'Eye (R)', path: 'M190,82 A15,10 0 1,1 190,102 A15,10 0 1,1 190,82 Z' },
  { id: 'back_of_head', label: 'Back of Head', path: 'M100,125 Q150,190 200,125 L190,165 Q150,185 110,165 Z' },
  { id: 'neck', label: 'Neck', path: 'M130,170 L170,170 L165,195 L135,195 Z' },
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

