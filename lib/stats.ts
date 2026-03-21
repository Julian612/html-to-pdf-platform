// In-memory request statistics (resets on server restart)

interface RequestStat {
  timestamp: number;
  success: boolean;
  endpoint: string;
  error?: string;
}

const stats: RequestStat[] = [];
const MAX_STATS = 1000;

export function recordRequest(endpoint: string, success: boolean, error?: string) {
  stats.push({ timestamp: Date.now(), success, endpoint, error });
  if (stats.length > MAX_STATS) stats.shift();
}

export function getStats() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  const today = stats.filter(s => now - s.timestamp < oneDay);
  const thisHour = stats.filter(s => now - s.timestamp < oneHour);
  const recentErrors = stats
    .filter(s => !s.success && s.error)
    .slice(-5)
    .reverse()
    .map(s => ({ time: new Date(s.timestamp).toISOString(), endpoint: s.endpoint, error: s.error }));

  return {
    requestsToday: today.length,
    requestsThisHour: thisHour.length,
    successesToday: today.filter(s => s.success).length,
    errorsToday: today.filter(s => !s.success).length,
    recentErrors,
  };
}
