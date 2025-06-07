# **App Name**: Migreen

## Core Features:

- Green Light Therapy Engine: Display a full-screen interface emitting green light (520-540 nm) during therapy sessions. The interface has an adjustable timer countdown at the top center in large, high-contrast font and defaults to a maximum 90-minute session. A long-press 'Exit' button is present to prevent accidental termination.
- Pre-Session Pain Input: Enable users to input pain intensity (0-10 slider), affected head areas (via an interactive SVG diagram with forehead, temples, eyes, etc), potential triggers (stress, screen time, noise, hormones, food, weather as checkboxes), and optional notes before starting the light therapy session.
- Therapy Recommendation Logic: Automatically recommend therapy duration (20, 45, or 60-90 minutes) based on pain level (1-3, 4-6, or 7-10 respectively) with the ability for users to manually override and adjust as needed.
- Post-Session Feedback: Record a relief score (0-10 slider) and medication intake (yes/no) and optional notes after each session to measure therapy effectiveness and symptom tracking.
- History and Analytics: Display a calendar view and list of historical session data, including pain intensity, duration, and relief scores in chart formats. Implement filters for data based on dates, pain level, or relief rating. Offer the option to export logs as CSV or PDF.
- Settings: Implement settings panel where a user can set default session length, adjust notification time, vibration feedback, and enable or disable dark theme.
- AI Personalized Therapy Adjustment: Based on collected usage data, our app uses generative AI as a tool to find an ideal therapy regimen.

## Style Guidelines:

- Primary color: Soft green (#A7D1AB), promoting relaxation and healing.
- Background color: Light grayish-green (#F0F4F0), maintaining a calm, clinical, and uncluttered appearance.
- Accent color: Pale Yellow (#F2E8C9) for interactive elements and highlights, ensuring visual clarity without being jarring.
- Body text: 'PT Sans', sans-serif. Headlines: 'PT Sans', sans-serif.
- Use soft, rounded icons with a consistent line weight. Icons should be monochromatic, using the primary green color. Minimize visual clutter and ensure accessibility through clear and recognizable symbols.
- Maintain a clean, uncluttered interface using the Material 3 guidelines. Employ rounded corners, large touch targets, and adequate spacing to ensure ease of use and accessibility. Favor soft gradients over hard lines for visual comfort.
- Transitions: Employ only fade, scale and opacity effects for smooth transitions. Avoid any strobing, flickering, or pulsing effects. For elements with changing states, implement cross-fading with a moderate duration of 200-300ms to ensure seamless user experience.