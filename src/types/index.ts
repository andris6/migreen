
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
  preSessionNotes?: string; // Changed from notes
  recommendedDuration: number; // in minutes
}

export interface PostSessionData {
  reliefScore: number;
  medicationTaken: boolean;
  postSessionNotes?: string; // Changed from notes
}

export interface TherapySession extends PreSessionData, PostSessionData {
  id: string;
  startTime: string; // ISO string
  actualDuration: number; // in minutes
  endTime: string; // ISO string
  // Ensure preSessionNotes and postSessionNotes are part of the final type
  // This is implicitly handled by extending PreSessionData and PostSessionData
}

export interface Settings {
  defaultSessionLength: number; // minutes
  notificationTime: string; // e.g., "15min_before" (conceptual)
  vibrationFeedback: boolean;
  darkMode: boolean;
}
