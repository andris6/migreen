
'use client';

import type { HeadArea } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface HeadDiagramProps {
  selectedAreas: HeadArea[];
  onChange: (selectedAreas: HeadArea[]) => void;
}

// Adjusted paths for a more human-like representation within viewBox="0 0 300 200"
const areas: { id: HeadArea; label: string; path: string; }[] = [
  { id: 'top_of_head', label: 'Top of Head', path: 'M125,20 Q150,10 175,20 L185,45 Q150,35 115,45 Z' },
  { id: 'forehead', label: 'Forehead', path: 'M100,46 L200,46 L190,75 L110,75 Z' },
  { id: 'temples', label: 'Temple (L)', path: 'M70,70 C50,80 45,125 70,135 L90,125 C75,115 75,90 90,75 Z' },
  { id: 'temples', label: 'Temple (R)', path: 'M230,70 C250,80 255,125 230,135 L210,125 C225,115 225,90 210,75 Z' },
  { id: 'eyes', label: 'Eye Region (L)', path: 'M95,80 L135,80 L135,105 L95,105 Z' }, // Rectangular region for eye area
  { id: 'eyes', label: 'Eye Region (R)', path: 'M165,80 L205,80 L205,105 L165,105 Z' }, // Rectangular region for eye area
  { id: 'back_of_head', label: 'Back of Head', path: 'M100,130 Q150,195 200,130 L185,170 Q150,190 115,170 Z' },
  { id: 'neck', label: 'Neck', path: 'M130,175 L170,175 L170,195 L130,195 Z' },
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

  // A more standard, less "face-like" base head outline
  const baseHeadPath = "M150,10 C70,10 30,70 70,140 C90,180 120,195 150,195 C180,195 210,180 230,140 C270,70 230,10 150,10 Z";

  return (
    <div className="w-full max-w-xs mx-auto">
      <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" data-ai-hint="head outline human">
        {/* Base head outline */}
        <path d={baseHeadPath} 
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

