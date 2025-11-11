import React from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';

const StyledLink = styled.a`
  color: ${({ $highlighted }) =>
    $highlighted ? 'rgba(255, 255, 255, 0.92)' : 'var(--color-accent)'};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Wrap = styled.div`
  padding: 0.75rem;
  background: ${({ $highlighted }) =>
    $highlighted ? 'inherit' : 'var(--color-background)'};
  color: ${({ $highlighted }) => ($highlighted ? 'white' : 'inherit')};
  border-radius: var(--radius-base);
  transition: background var(--transition-base), color var(--transition-base);
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Meta = styled.div`
  color: ${({ $highlighted }) =>
    $highlighted ? 'rgba(255, 255, 255, 0.65)' : '#777'};
  font-size: 0.85rem;
  margin-top: 0.25rem;
  opacity: 0.6;
`;

export default function BlockCard({ block, highlighted = false }) {
  const kind = block.class || block.base_class || 'Block';
  const title = block.title || block.generated_title || block.source?.title || ''
  const updated = block.updated_at || block.created_at;

  const body = (() => {
    if (block.image && block.image?.display) {
      const src = block.image.display.url || block.image.original?.url;
      const alt = title || 'Image';
      const img = (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            borderRadius: 'var(--radius-base)',
            display: 'block',
          }}
        />
      );
      if (block.source && block.source.url) {
        return (
          <StyledLink
            href={block.source.url}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'block' }}
            $highlighted={highlighted}
          >
            {img}
          </StyledLink>
        );
      }
      return img;
    }
    
    if (block.embed && block.embed.html) {
      const paramJoin = (url, params) => {
        try {
          const u = new URL(url, window.location.origin);
          Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
          return u.toString();
        } catch {
         
          const sep = url.includes('?') ? '&' : '?';
          const qs = Object.entries(params).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
          return `${url}${sep}${qs}`;
        }
      };

      const withAutoplay = block.embed.html
       
        .replace(/<video\s+/gi, '<video autoplay loop muted playsinline ')
        .replace(/<audio\s+/gi, '<audio autoplay loop muted ')
       
        .replace(/<iframe([^>]+)src="([^"]+)"([^>]*)>/gi, (m, pre, src, post) => {
          let newSrc = src;
          if (/youtube\.com|youtu\.be/.test(src)) {
           
            const idMatch = src.match(/(?:embed\/|v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
            const vid = idMatch ? idMatch[1] : undefined;
            newSrc = paramJoin(src, { autoplay: 1, mute: 1, loop: 1, playsinline: 1, controls: 1, ...(vid ? { playlist: vid } : {}) });
          } else if (/vimeo\.com/.test(src)) {
            newSrc = paramJoin(src, { autoplay: 1, muted: 1, loop: 1, background: 1 });
          } else {
           
            newSrc = paramJoin(src, { autoplay: 1, muted: 1, loop: 1 });
          }
         
          const allowAttr = /allow="[^"]*autoplay/.test(m) ? '' : ' allow="autoplay; encrypted-media; picture-in-picture"';
          const allowFs = /allowfullscreen/i.test(m) ? '' : ' allowfullscreen';
          return `<iframe${pre}src="${newSrc}"${post}${allowAttr}${allowFs}>`;
        });

      return <div dangerouslySetInnerHTML={{ __html: withAutoplay }} />;
    }

   
    if (
      (block.attachment && block.attachment.content_type && block.attachment.content_type.startsWith('video')) ||
      (block.attachment && /\.(mp4|webm|ogg|ogv|mov)(\?|$)/i.test(block.attachment.url || ''))
    ) {
      return (
        <video
          src={block.attachment.url}
          autoPlay
          loop
          muted
          playsInline
          controls
          style={{ width: '100%', borderRadius: 8 }}
        />
      );
    }

   
    if (
      (block.attachment && block.attachment.content_type && block.attachment.content_type.startsWith('audio')) ||
      (block.attachment && /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(block.attachment.url || ''))
    ) {
      return (
        <audio
          src={block.attachment.url}
          autoPlay
          loop
          muted
          controls
          style={{ width: '100%' }}
        />
      );
    }

   
    if (block.image && block.image.original && typeof block.image.original.content_type === 'string' && block.image.original.content_type.startsWith('video')) {
      const src = block.image.original.url || block.image.display?.url;
      if (src) {
        return (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            controls
            style={{ width: '100%', borderRadius: 8 }}
          />
        );
      }
    }

    if (block.content) {
      return <div style={{ whiteSpace: 'pre-wrap' }}>{block.content}</div>;
    }
    if (block.source && block.source.url) {
      return (
        <StyledLink
          href={block.source.url}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block' }}
          $highlighted={highlighted}
        >
          {title || block.source.url}
        </StyledLink>
      );
    }

    if (block.attachment && typeof block.attachment.url === 'string') {
      const aUrl = block.attachment.url;
      const ytMatchA = aUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
      if (ytMatchA) {
        const id = ytMatchA[1];
        const embed = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playsinline=1&controls=1&playlist=${id}`;
        return (
          <div>
            <iframe
              src={embed}
              title={title || 'YouTube video'}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 8 }}
            />
          </div>
        );
      } else {
        return (
          <StyledLink
            href={block.attachment.url}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'block' }}
            $highlighted={highlighted}
          >
            {title || block.attachment.url}
          </StyledLink>
        );
      }
    }
    if (title) return <div style={{ whiteSpace: 'pre-wrap' }}>{title}</div>;
    return <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(block, null, 2)}</pre>;
  })();

  return (
    <Wrap $highlighted={highlighted}>
      {body}
      <Meta $highlighted={highlighted}>
        {kind} · {updated ? format(new Date(updated), 'PPP p') : ''}
      </Meta>
    </Wrap>
  );
}