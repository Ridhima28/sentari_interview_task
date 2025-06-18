type VoiceEntry = { transcript_user: string };
type ProcessedTask = { text: string; dueDate: string | null; status: 'pending' | 'completed'; category: string };
type ProcessedResult = { tasks: ProcessedTask[]; tagFrequencies: Record<string, number> };

const timeframePattern = /\b(this week|next week|weekend|tomorrow|tonight|today|later this week|over the next few days|sometime this week|\b\w+day\b)\b/gi;

function extractTimeframe(actionStr: string): { action: string; timeframe: string | null } {
  const match = timeframePattern.exec(actionStr);
  if (match) {
    const timeframe = match[0];
    const action = actionStr.replace(timeframe, '').trim();
    return { action, timeframe };
  }
  return { action: actionStr, timeframe: null };
}

export function processEntries(entries: VoiceEntry[]): ProcessedResult {
  const tasks: ProcessedTask[] = [];
  const tagFrequencies: Record<string, number> = {};

  // Patterns for common planning and action phrases
  const planningPattern = /(planning to|going to|will|want to|intend to)\s+(.+)/i;
  const actionPattern = /(?:i'm|i am|i have|i'll|i would|i'll be)\s+(.+)/i;

  for (const entry of entries) {
    const text = entry.transcript_user.toLowerCase();

    let matched = false;

    // Try planning pattern first
    const planMatch = planningPattern.exec(text);
    if (planMatch) {
      const { action, timeframe } = extractTimeframe(planMatch[2]);
      if (action) {
        tasks.push({
          text: action,
          dueDate: timeframe,
          status: 'pending',
          category: 'general',
        });
        matched = true;
      }
    }

    // If no planning matched, try action pattern
    if (!matched) {
      const actionMatch = actionPattern.exec(text);
      if (actionMatch) {
        const { action, timeframe } = extractTimeframe(actionMatch[1]);
        if (action) {
          tasks.push({
            text: action,
            dueDate: timeframe,
            status: 'pending',
            category: 'general',
          });
          matched = true;
        }
      }
    }

    // Could add more patterns here...

    // Ignore entries that do not match any pattern
  }

  return { tasks, tagFrequencies };
}
