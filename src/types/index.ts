export type HeadArea = "forehead" | "temples" | "eyes" | "back_of_head" | "top_of_head" | "neck";

export interface Trigger {
  id: string;
  name: string;
}

export const availableTriggers: Trigger[] = [
  { id: "stress", name: "Stress" },
  { id: "screen_time", name: "Screen Time" },
  { id: "noise", name: "Noise" },
  { id: "hormones", name: "Hormones" },
  { id: "food", name: "Food" },
  { id: "weather", name: "Weather" },
];

export interface PreSessionData {
  painIntensity: number;
  affectedAreas: HeadArea[];
  triggers: string[]; // array of trigger ids
  notes?: string;
  recommendedDuration: number; // in minutes
}

export interface PostSessionData {
  reliefScore: number;
  medicationTaken: boolean;
  notes?: string;
}

export interface TherapySession extends PreSessionData, PostSessionData {
  id: string;
  startTime: string; // ISO string
  actualDuration: number; // in minutes
  endTime: string; // ISO string
}

export interface Settings {
  defaultSessionLength: number; // minutes
  notificationTime: string; // e.g., "15min_before" (conceptual)
  vibrationFeedback: boolean;
  darkMode: boolean;
}
