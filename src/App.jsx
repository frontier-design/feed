import React from "react";
import { Page, Header, ChannelList, GlobalStyle } from "./styles.js";
import { fetchGroupChannels } from "./lib/arena.js";
import Channel from "./components/Channel.jsx";
import FeaturedChannel from "./components/FeaturedChannel.jsx";

const PINNED_IDENTIFIERS = ['what is this?', 'what-is-this'];

function isPinnedChannel(channel) {
  if (!channel) return false;
  const title = (channel.title || '').trim().toLowerCase();
  const slug = (channel.slug || '').trim().toLowerCase();
  return PINNED_IDENTIFIERS.includes(title) || PINNED_IDENTIFIERS.includes(slug);
}

export default function App() {
  const [channels, setChannels] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    let isInitialLoad = true;

    const loadChannels = () => {
      if (cancelled) return;
      if (isInitialLoad) setLoading(true);
      setError('');
      fetchGroupChannels()
        .then((chs) => {
          if (cancelled) return;
          const byUpdated = [...chs].sort((a, b) => {
            const pa = isPinnedChannel(a) ? 1 : 0;
            const pb = isPinnedChannel(b) ? 1 : 0;
            if (pa !== pb) return pb - pa;
            const da = new Date(a.updated_at || a.created_at || 0).getTime();
            const db = new Date(b.updated_at || b.created_at || 0).getTime();
            return db - da;
          });
          setChannels(byUpdated);
        })
        .catch((e) => {
          if (cancelled) return;
          setError(e?.message || 'Failed to fetch group channels');
        })
        .finally(() => {
          if (cancelled || !isInitialLoad) return;
          setLoading(false);
          isInitialLoad = false;
        });
    };

    loadChannels();
    const interval = setInterval(loadChannels, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const featuredChannel = React.useMemo(
    () => channels.find(isPinnedChannel) || null,
    [channels]
  );
  const regularChannels = React.useMemo(
    () => channels.filter((c) => !isPinnedChannel(c)),
    [channels]
  );

  // const siteTitle = import.meta.env.VITE_SITE_TITLE || 'Entity Feed';

  return (
    <Page>
      <GlobalStyle />
      {/* <Header>
        <h1>{siteTitle}</h1>
        <p>Live blog from Are.na: channels starting with “Log”, most recently updated shown first.</p>
      </Header> */}

      {loading && <div>Loading channels…</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      {!loading && !error && (
        <ChannelList data-has-featured={Boolean(featuredChannel)}>
          {channels.length === 0 && <div>No channels found in this group.</div>}
          {channels.length > 0 && (
            <>
              {featuredChannel && (
                <FeaturedChannel key={featuredChannel.id} channel={featuredChannel} />
              )}
              {regularChannels.map((c) => (
                <Channel key={c.id} channel={c} />
              ))}
            </>
          )}
        </ChannelList>
      )}
    </Page>
  );
}