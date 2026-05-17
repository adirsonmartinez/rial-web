"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const FALLBACK_COUNT = 55_124;

export function useUserCount() {
  const [count, setCount] = useState(FALLBACK_COUNT);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.rpc("get_user_count").then(({ data, error }) => {
      if (cancelled || error) return;
      if (typeof data === "number") setCount(data);
    });

    const channel = supabase
      .channel("user-count")
      .on("broadcast", { event: "count_changed" }, (msg) => {
        const next = (msg.payload as { count?: number } | null)?.count;
        if (typeof next === "number") setCount(next);
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
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
    const k = Math.floor(count / 5_000) * 5;
    if (k === 0) return `+${Math.floor(count / 1_000)}K`;
    return `+${k}K`;
  }
  return `+${count}`;
}
