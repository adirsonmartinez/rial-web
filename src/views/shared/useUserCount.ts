import { useState, useEffect } from "react";

// TODO: Connect to Supabase realtime
// const supabase = createClient(...)
// supabase.channel('user-count').on('broadcast', { event: 'count' }, (payload) => { ... })

const CURRENT_COUNT = 50_124;

export function useUserCount() {
  const [count, setCount] = useState(CURRENT_COUNT);

  useEffect(() => {
    // Placeholder: replace with Supabase realtime subscription
    setCount(CURRENT_COUNT);
  }, []);

  return count;
}

export function formatExactCount(count: number): string {
  const padded = count.toString().padStart(7, "0");
  return `${padded[0]}.${padded.slice(1, 4)}.${padded.slice(4)}`;
}

export function formatMilestone(count: number): string {
  if (count >= 1_000_000) {
    const m = Math.floor(count / 1_000_000);
    return `+${m}M`;
  }
  if (count >= 1_000) {
    const k = Math.floor(count / 10_000) * 10;
    if (k === 0) return `+${Math.floor(count / 1_000)}K`;
    return `+${k}K`;
  }
  return `+${count}`;
}
