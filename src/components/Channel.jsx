import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  BlockGrid,
  Card,
  ChannelHeader,
  HeaderRight,
  ToggleButton,
  Button,
  FooterRow,
} from "../styles.js";
import BlockCard from "./BlockCard.jsx";
import useChannelBlocks from "../hooks/useChannelBlocks.js";

export default function Channel({ channel }) {
  const [pageSize, setPageSize] = React.useState(10);
  const [collapsed, setCollapsed] = React.useState(false);

  const slug = channel.slug || channel.id;
  const { blocks, loading, error } = useChannelBlocks(slug, {
    per: 50,
    refreshMs: 60000,
  });

  const updated = channel.updated_at || channel.created_at;
  const Container = Card;
  const visible = blocks.slice(0, pageSize);
  const allowCollapse = true;
  const showBody = !collapsed;
  const toggleLabel = collapsed ? "Expand channel" : "Collapse channel";
  const showMeta = true;

  return (
    <Container data-collapsed={collapsed}>
      <ChannelHeader>
        <h2>
          {(channel.title || slug).replace(/^Log\s*\/\s*/i, '')}
        </h2>
        <HeaderRight>
          {showMeta && (
            <div className="meta">
              Updated {updated ? formatDistanceToNow(new Date(updated), { addSuffix: true }) : '—'}
              {' · '}
              {blocks.length} blocks
            </div>
          )}
          {allowCollapse && (
            <ToggleButton
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={`${toggleLabel} ${(channel.title || slug).trim()}`}
              aria-expanded={!collapsed}
              title={toggleLabel}
            >
              {collapsed ? '+' : '−'}
            </ToggleButton>
          )}
        </HeaderRight>
      </ChannelHeader>

      {showBody && loading && <div>Loading blocks…</div>}
      {showBody && error && <div style={{ color: 'crimson' }}>{error}</div>}

      {showBody && !loading && !error && (
        <>
          <BlockGrid>
            {visible.map((b) => (
              <BlockCard key={b.id} block={b} highlighted={false} />
            ))}
          </BlockGrid>
          {blocks.length > pageSize && (
            <FooterRow>
              <Button onClick={() => setPageSize((n) => n + 10)}>Load more</Button>
            </FooterRow>
          )}
        </>
      )}
    </Container>
  );
}