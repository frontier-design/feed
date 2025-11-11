import axios from "axios";

const ARENA_BASE = "https://api.are.na/v2";
const TOKEN = import.meta.env.VITE_ARENA_ACCESS_TOKEN?.trim();
const GROUP_SLUG = "frontier";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
};

// Axios instance
const api = axios.create({
  baseURL: ARENA_BASE,
  headers: {
    ...NO_CACHE_HEADERS,
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  },
});

// Simple pager for endpoints that support page/per
async function getAllPages(path, params = {}, maxPages = 20) {
  const per = params.per ?? 50;
  let page = 1;
  const out = [];

  while (page <= maxPages) {
    const { data } = await api.get(path, { params: { ...params, page, per } });
    // Data could be {channels:[], ...} OR an array. Normalize:
    const items = Array.isArray(data)
      ? data
      : data.channels || data.contents || data.blocks || [];
    if (!items.length) break;
    out.push(...items);
    if (items.length < per) break; // last page
    page++;
  }
  return out;
}

/**
 * Fetch channels from a group, robust to slight API variations.
 * Tries /groups/:slug/channels first, falls back to /groups/:slug then reading .channels.
 */
export async function fetchGroupChannels(groupSlug = GROUP_SLUG) {
  if (!groupSlug) throw new Error("Missing Are.na group slug.");
  const cacheBust = Date.now();

  // Preferred: explicit channels endpoint
  try {
    const channels = await getAllPages(`/groups/${groupSlug}/channels`, {
      per: 100,
      _cb: cacheBust,
    });
    if (channels?.length) return channels;
  } catch (e) {
    // fall through to fallback
    console.warn(
      `Failed to fetch channels for group "${groupSlug}" via /groups/:slug/channels:`,
      e.message
    );
  }

  // Fallback: group payload may include channels (possibly paginated)
  const { data: group } = await api.get(`/groups/${groupSlug}`, {
    params: { _cb: cacheBust },
  });
  if (group?.channels?.length) return group.channels;

  // Last resort: try a single page channels call (some older gateways)
  const { data } = await api.get(`/groups/${groupSlug}/channels`, {
    params: { per: 100, _cb: cacheBust },
  });
  return data.channels || data || [];
}

/**
 * Fetch contents (blocks) for a channel by slug.
 * Returns blocks; you can request different block types via params if desired.
 */
export async function fetchChannelContents(channelSlug, { per = 50 } = {}) {
  if (!channelSlug) return [];
  const cacheBust = Date.now();
  const blocks = await getAllPages(`/channels/${channelSlug}/contents`, {
    per,
    _cb: cacheBust,
  });
  return blocks;
}

/**
 * Utility: filter channels whose title starts with "Log" and sort by updated_at desc
 */
export function selectLogChannels(channels = []) {
  const startsWithLog = (s) => typeof s === "string" && /^log/i.test(s.trim());
  const clean = channels.filter((ch) =>
    startsWithLog(ch.title || ch.slug || "")
  );
  // Sort by updated_at desc (fallback to created_at)
  return clean.sort((a, b) => {
    const da = new Date(a.updated_at || a.created_at || 0).getTime();
    const db = new Date(b.updated_at || b.created_at || 0).getTime();
    return db - da;
  });
}
