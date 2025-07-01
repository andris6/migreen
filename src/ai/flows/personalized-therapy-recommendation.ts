'use server';
/**
 * @fileOverview AI-powered personalized therapy recommendation flow.
 *
 * This file defines a Genkit flow that analyzes a user's historical migraine therapy session data
 * to provide personalized, empathetic, and actionable recommendations.
 *
 * @requires genkit
 * @requires zod
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedTherapyRecommendationInputSchema = z.object({
  sessionHistory: z
    .string()
    .describe(
      'A JSON string containing the user session history data, including pain levels, relief scores, durations, triggers, and notes for each session.'
    ),
});

export type PersonalizedTherapyRecommendationInput = z.infer<
  typeof PersonalizedTherapyRecommendationInputSchema
>;

const PersonalizedTherapyRecommendationOutputSchema = z.object({
  recommendedDuration: z
    .string()
    .describe(
      'The AI-recommended therapy duration in minutes. Frame this as a specific, actionable suggestion (e.g., "25-35 minutes").'
    ),
  recommendedTimeOfDay: z
    .string()
    .describe(
      'The AI-recommended time of day for therapy. This should be based on patterns in the data (e.g., "Late Afternoon or Evening").'
    ),
  otherAdjustments: z
    .string()
    .describe(
      'Other actionable adjustments or insights. This could include notes on common triggers, the effectiveness of medication, or other patterns noticed. Present this as a bulleted list or a few short, clear sentences.'
    ),
});

export type PersonalizedTherapyRecommendationOutput = z.infer<
  typeof PersonalizedTherapyRecommendationOutputSchema
>;

export async function personalizedTherapyRecommendation(
  input: PersonalizedTherapyRecommendationInput
): Promise<PersonalizedTherapyRecommendationOutput> {
  return personalizedTherapyRecommendationFlow(input);
}

const personalizedTherapyRecommendationPrompt = ai.definePrompt({
  name: 'personalizedTherapyRecommendationPrompt',
  input: {
    schema: PersonalizedTherapyRecommendationInputSchema,
  },
  output: {
    schema: PersonalizedTherapyRecommendationOutputSchema,
  },
  prompt: `You are a caring and empathetic AI assistant for Migreen, a migraine therapy app. Your goal is to help users find relief by analyzing their session history.

Analyze the provided session history to identify patterns and offer personalized, actionable recommendations. Be encouraging and supportive in your tone.

Based on the user's historical session data below, provide personalized recommendations for:
1.  **Therapy Duration**: Suggest an optimal range.
2.  **Time of Day**: Identify if a particular time seems more effective.
3.  **Other Adjustments**: Note any correlations you see (e.g., common triggers, pain levels vs. relief) and suggest adjustments.

Session History (JSON format):
{{{sessionHistory}}}

Please provide your response in a clear, structured, and easy-to-understand format.
`,
});

const personalizedTherapyRecommendationFlow = ai.defineFlow(
  {
    name: 'personalizedTherapyRecommendationFlow',
    inputSchema: PersonalizedTherapyRecommendationInputSchema,
    outputSchema: PersonalizedTherapyRecommendationOutputSchema,
  },
  async input => {
    const {output} = await personalizedTherapyRecommendationPrompt(input);
    return output!;
  }
);
