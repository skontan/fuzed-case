# Fuzed Case Application

## Overview

This application is built with React Native with Expo to provide real-time pose detection using TensorFlow's MoveNet model. It integrates a live camera feed with custom components for pose estimation and control, ensuring a smooth and interactive user experience.

## How to Run and Test

1. Install dependencies:
   ```
   npm install
   ```
2. Start the Expo server:
   ```
   npm start
   ```
3. Launch the application on a physical device using the Expo Go app.

## Decisions and Trade-offs

- Chose Expo for rapid development and easy deployment.
- Utilized TensorFlow MoveNet for a balance between performance and accuracy.
- Extracted TensorFlow logic to separate hook.
- Animates SVG dots on UI thread instead of JS thread.
- Split code into reusable components to improve maintainability.
- Lacking error handling due to time constaints.
- Only focused on iOS when coding.

## Quality Assurance

- Followed React Native and Expo best practices for structure and performance.
- Maintained modularity to make testing and debugging easier.
- Considered scalability and readability by keeping components focused and concise.
- Continiously live tested the app while coding.
- Only tested on iPhone 16 Pro.

## Future Improvements

- Introduce comprehensive unit and integration tests (Jest, React Native Testing Library).
- Test app on more physical devices.
- Optimize tensor processing and memory management for better performance.
- Add error boundaries and improved error handling for a more robust application.
- Enhance the UI/UX.
