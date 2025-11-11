import React from "react";
import {
  BlockGrid,
  FeaturedCard,
  ChannelHeader,
  Button,
  FooterRow,
} from "../styles.js";
import BlockCard from "./BlockCard.jsx";
import useChannelBlocks from "../hooks/useChannelBlocks.js";

export default function FeaturedChannel({ channel }) {
  const [pageSize, setPageSize] = React.useState(10);
  const slug = channel.slug || channel.id;

  const { blocks, loading, error } = useChannelBlocks(slug, {
    per: 50,
    refreshMs: 15000,
  });

  const visible = blocks.slice(0, pageSize);

  return (
    <FeaturedCard>
      <ChannelHeader>
        <h2>{(channel.title || slug).replace(/^Log\s*\/\s*/i, "")}</h2>
      </ChannelHeader>

      {loading && <div>Loading blocks…</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {!loading && !error && (
        <>
          <BlockGrid>
            {visible.map((b) => (
              <BlockCard key={b.id} block={b} highlighted />
            ))}
          </BlockGrid>
          {blocks.length > pageSize && (
            <FooterRow>
              <Button onClick={() => setPageSize((n) => n + 10)}>
                Load more
              </Button>
            </FooterRow>
          )}
        </>
      )}
    </FeaturedCard>
  );
}

