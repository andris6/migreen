
export type HeadArea = "forehead" | "temples" | "eyes" | "back_of_head" | "top_of_head" | "neck" | "none";

export const availableHeadAreas: { id: HeadArea; name: string }[] = [
  { id: "forehead", name: "Forehead" },
  { id: "temples", name: "Temples" },
  { id: "eyes", name: "Eyes / Around Eyes" },
  { id: "back_of_head", name: "Back of Head" },
  { id: "top_of_head", name: "Top of Head" },
  { id: "neck", name: "Neck" },
  { id: "none", name: "None" },
];

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
  affectedArea?: HeadArea; // Changed from affectedAreas: HeadArea[]
  triggers: string[]; // array of trigger ids
  preSessionNotes?: string;
  recommendedDuration: number; // in minutes
}

export interface PostSessionData {
  reliefScore: number;
  medicationTaken: boolean;
  postSessionNotes?: string;
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
