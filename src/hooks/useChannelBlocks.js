import React from "react";
import { fetchChannelContents } from "../lib/arena.js";

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
          if (!cancelled) setBlocks(items);
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
