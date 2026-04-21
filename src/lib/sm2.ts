// src/lib/sm2.ts

export function calculateSM2(
  quality: number, // User rating 1-5
  previousInterval: number,
  previousRepetition: number,
  previousEfactor: number
) {
  let interval: number;
  let repetition: number;
  let efactor: number;

  if (quality >= 3) {
    // Correct response
    if (previousRepetition === 0) {
      interval = 1;
    } else if (previousRepetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * previousEfactor);
    }
    repetition = previousRepetition + 1;
  } else {
    // Incorrect response
    repetition = 0;
    interval = 1;
  }

  // Update E-factor (clamped between 1.3 and 2.5)
  efactor = previousEfactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (efactor < 1.3) efactor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, repetition, efactor, nextReview };
}