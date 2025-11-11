import React from "react";
import { fetchChannelContents } from "../lib/arena.js";

function sortBlocks(items = []) {
  return [...items].sort((a, b) => {
    const posA = Number.isFinite(Number(a.position))
      ? Number(a.position)
      : Number.NEGATIVE_INFINITY;
    const posB = Number.isFinite(Number(b.position))
      ? Number(b.position)
      : Number.NEGATIVE_INFINITY;

    if (posA !== posB) return posB - posA; // larger / more recent position first

    const dateA = new Date(
      a.connected_at || a.updated_at || a.created_at || 0
    ).getTime();
    const dateB = new Date(
      b.connected_at || b.updated_at || b.created_at || 0
    ).getTime();

    return dateB - dateA; // fallback: newest first
  });
}

export function useChannelBlocks(slug, { per = 50, refreshMs = 60000 } = {}) {
  const [blocks, setBlocks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!slug) return undefined;

    let cancelled = false;
    let isInitialLoad = true;
    let intervalId;

    const loadBlocks = () => {
      if (cancelled) return;
      if (isInitialLoad) setLoading(true);
      setError("");

      fetchChannelContents(slug, { per })
        .then((items) => {
          if (!cancelled) setBlocks(sortBlocks(items));
        })
        .catch((e) => {
          if (!cancelled)
            setError(e?.message || "Failed to load channel contents");
        })
        .finally(() => {
          if (cancelled) return;
          if (isInitialLoad) {
            setLoading(false);
            isInitialLoad = false;
          }
        });
    };

    loadBlocks();

    if (refreshMs) {
      intervalId = setInterval(loadBlocks, refreshMs);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [slug, per, refreshMs]);

  return { blocks, loading, error };
}

export default useChannelBlocks;
