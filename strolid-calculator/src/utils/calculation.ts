// Core calculation functions for the Strolid Missed Revenue Calculator

export function calcMissed(calls: number, answerRate: number): number {
  return Math.round(calls * (1 - answerRate / 100));
}

export function calcLostRevenue(
  missed: number,
  convRate: number,
  gp: number
): number {
  return Math.round(missed * (convRate / 100) * gp);
}

export function calcReclaimed(
  calls: number,
  targetAnswer = 95,
  convRate: number,
  gp: number
): number {
  const missedAtTarget = calcMissed(calls, targetAnswer);
  const missedCurrent = calcMissed(calls, 65); // Assuming current default
  const additionalAnswered = missedCurrent - missedAtTarget;
  return Math.round(additionalAnswered * (convRate / 100) * gp);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Calculate metrics for the comparison bar
export interface ComparisonMetrics {
  current: number;
  withStrolid: number;
  delta: number;
  deltaPercentage: number;
}

export function calculateComparison(
  calls: number,
  currentAnswerRate: number,
  convRate: number,
  gp: number
): ComparisonMetrics {
  const currentRevenue = calls * (currentAnswerRate / 100) * (convRate / 100) * gp;
  const strolidRevenue = calls * 0.95 * (convRate / 100) * gp; // 95% answer rate
  const delta = strolidRevenue - currentRevenue;
  const deltaPercentage = ((delta / currentRevenue) * 100);

  return {
    current: Math.round(currentRevenue),
    withStrolid: Math.round(strolidRevenue),
    delta: Math.round(delta),
    deltaPercentage: Math.round(deltaPercentage * 10) / 10, // Round to 1 decimal
  };
}