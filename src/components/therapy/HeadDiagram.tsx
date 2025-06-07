
'use client';

import type { HeadArea } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface HeadDiagramProps {
  selectedAreas: HeadArea[];
  onChange: (selectedAreas: HeadArea[]) => void;
}

// Simplified rectangular paths for distinct clickable zones
// Format for <path d="...">: M x,y L x+w,y L x+w,y+h L x,y+h Z
const areas: { id: HeadArea; label: string; path: string; }[] = [
  { id: 'top_of_head', label: 'Top of Head', path: 'M110,5 L190,5 L190,35 L110,35 Z' },
  { id: 'forehead', label: 'Forehead', path: 'M100,40 L200,40 L200,70 L100,70 Z' },
  { id: 'temples', label: 'Temple (L)', path: 'M55,75 L95,75 L95,125 L55,125 Z' },
  { id: 'temples', label: 'Temple (R)', path: 'M205,75 L245,75 L245,125 L205,125 Z' },
  { id: 'eyes', label: 'Eyes/Around Eyes', path: 'M100,75 L200,75 L200,105 L100,105 Z' },
  { id: 'back_of_head', label: 'Back of Head', path: 'M90,130 L210,130 L210,180 L90,180 Z' },
  { id: 'neck', label: 'Neck', path: 'M125,180 L175,180 L175,195 L125,195 Z' },
];

// A more standard, less "face-like" base head outline
const baseHeadPath = "M150,10 C80,10 40,60 40,100 C40,140 80,190 150,190 C220,190 260,140 260,100 C260,60 220,10 150,10 Z";


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
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" data-ai-hint="simplified head diagram">
        <path d={baseHeadPath} 
              fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2"/>
        
        {areas.map((area) => (
          <path
            key={`${area.id}-${area.label}`} 
            d={area.path}
            fill={selected.includes(area.id) ? 'hsl(var(--accent))' : 'hsl(var(--secondary))'}
            stroke="hsl(var(--border))"
            strokeWidth="1.5" // Slightly thicker stroke for better visibility of zones
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
