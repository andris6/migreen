// src/ai/flows/personalized-therapy-recommendation.ts
'use server';

/**
 * @fileOverview AI-powered personalized therapy recommendation flow.
 *
 * This file defines a Genkit flow that analyzes a user's historical migraine therapy session data
 * (pain levels, relief scores, durations, notes) to provide personalized recommendations for
 * therapy durations, optimal times of day, and other relevant adjustments.
 *
 * @requires genkit
 * @requires zod
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the personalized therapy recommendation flow.
const PersonalizedTherapyRecommendationInputSchema = z.object({
  sessionHistory: z
    .string()
    .describe(
      'A string containing the user session history data, including pain levels, relief scores, durations, and notes for each session.'
    ),
});

export type PersonalizedTherapyRecommendationInput = z.infer<
  typeof PersonalizedTherapyRecommendationInputSchema
>;

// Define the output schema for the personalized therapy recommendation flow.
const PersonalizedTherapyRecommendationOutputSchema = z.object({
  recommendedDuration: z
    .string()
    .describe(
      'The AI-recommended therapy duration in minutes, based on the user session history data.'
    ),
  recommendedTimeOfDay: z
    .string()
    .describe(
      'The AI-recommended time of day for therapy sessions, based on the user session history data.'
    ),
  otherAdjustments: z
    .string()
    .describe(
      'Any other AI-recommended adjustments to the therapy regimen, based on the user session history data.'
    ),
});

export type PersonalizedTherapyRecommendationOutput = z.infer<
  typeof PersonalizedTherapyRecommendationOutputSchema
>;

// Define the personalized therapy recommendation function.
export async function personalizedTherapyRecommendation(
  input: PersonalizedTherapyRecommendationInput
): Promise<PersonalizedTherapyRecommendationOutput> {
  return personalizedTherapyRecommendationFlow(input);
}

// Define the prompt for the personalized therapy recommendation flow.
const personalizedTherapyRecommendationPrompt = ai.definePrompt({
  name: 'personalizedTherapyRecommendationPrompt',
  input: {
    schema: PersonalizedTherapyRecommendationInputSchema,
  },
  output: {
    schema: PersonalizedTherapyRecommendationOutputSchema,
  },
  prompt: `You are an AI assistant specializing in personalized migraine therapy recommendations.

  Based on the user's historical session data below, provide personalized recommendations for therapy duration, optimal times of day, and other relevant adjustments to optimize their migraine relief.

  Session History:
  {{sessionHistory}}

  Consider factors such as pain levels, relief scores, session durations, and any notes provided by the user.

  Provide your recommendations in a structured format.
  `, // Changed from triple curly braces to double for sessionHistory
});

// Define the Genkit flow for personalized therapy recommendations.
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
