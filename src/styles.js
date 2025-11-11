import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

import PPWriterWoff2 from "./assets/fonts/PPWriter-RegularText.woff2";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'PP Writer';
    src: local('PP Writer'),
         url(${PPWriterWoff2}) format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  body {
    font-family: 'PP Writer', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  :root {
    --font-family-base: 'PP Writer', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    --color-text: #222;
    --color-background: #fdfdfd;
    --color-border: rgba(110, 13, 243, 1);
    --color-accent: rgba(110, 13, 243, 1);
    --radius-base: 8px;
    --transition-base: 0.15s ease-in-out;
    --page-width: 600px;
  }
  a {
    color: rgba(110, 13, 243, 1);
    text-decoration: none;
    // background-color: rgba(110, 13, 243, 0.1);
    border: 0.5px solid rgba(110, 13, 243, 0.1);
    padding: 1rem;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export const Page = styled.main`
  max-width: var(--page-width, 600px);
  margin: 0 auto;
  padding: 2rem 1rem 6rem;
  line-height: 1.6;
  background: var(--color-background);
  color: var(--color-text);
`;

export const Header = styled.header`
  margin-bottom: 2rem;
  h1 {
    font-size: clamp(1.75rem, 3vw, 2.4rem);
    margin: 0 0 0.25rem;
    letter-spacing: -0.02em;
  }
  p {
    color: color-mix(in srgb, var(--color-text) 70%, white);
    margin: 0.25rem 0 0;
  }
`;

export const ChannelList = styled.section`
  display: grid;
  gap: 1.25rem;

  &[data-has-featured="true"] {
    padding-top: 18rem;
  }

  @media (min-width: 768px) {
    &[data-has-featured="true"] {
      padding-top: 0;
    }
  }
`;

export const Card = styled.article`
  background: var(--color-background);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: 1rem 1rem 0.75rem;
  line-height: 1.5;
`;

export const ChannelHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-bottom: 0.5rem;

  h2 {
    flex: 1 1 auto;
    font-size: 1.25rem;
    margin: 0;
    background: rgba(110, 13, 243, 0.1);
    color: rgba(110, 13, 243, 1);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-base);
  }
  .meta {
    color: color-mix(in srgb, var(--color-text) 60%, white);
    font-size: 0.9rem;
  }
`;

export const HeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const ToggleButton = styled.button`
  appearance: none;
  border: 0.5px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 88%, white 12%);
  color: var(--color-text);
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-base), transform 0.1s ease,
    border-color var(--transition-base);
  font-size: 0.95rem;
  line-height: 1;
  padding: 0;

  &:hover {
    background: color-mix(in srgb, var(--color-background) 78%, white 22%);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const FeaturedCard = styled(Card)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  width: min(310px, calc(100% - 2.5rem));
  max-height: calc(100vh - 2.5rem);
  overflow-y: auto;
  background: var(--color-border);
  border-color: var(--color-border);
  color: white;
  z-index: 10;

  ${ChannelHeader} h2 {
    color: white;
    background: none;
  }

  ${ChannelHeader} .meta {
    color: rgba(255, 255, 255, 0.75);
  }

  ${ToggleButton} {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  ${ToggleButton}:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 767px) {
    left: 1rem;
    right: 1rem;
    width: calc(100% - 2rem);
  }
`;

export const BlockGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const Button = styled.button`
  appearance: none;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-base);
  padding: 0.5rem 1.25rem;
  background: var(--color-accent);
  cursor: pointer;
  font-size: 0.95rem;
  font-family: "PP Writer", var(--font-family-base);
  color: white;
  letter-spacing: 0.01em;
  font-weight: 500;
  transition: background var(--transition-base), transform 0.02s ease;
  &:hover {
    background: color-mix(in srgb, var(--color-accent) 92%, white 8%);
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 0 0.25rem;
`;
