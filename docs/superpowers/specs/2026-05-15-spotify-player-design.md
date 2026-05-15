# Spotify Player Widget — Design Spec

## Overview

A floating, collapsible Spotify embed widget fixed to the bottom-right corner of the portfolio. Collapsed by default (small animated button); expands on click to reveal a compact Spotify iframe player.

## Behavior

**Collapsed state**
- A small pill/button fixed to `bottom: 24px; right: 24px`
- Displays three animated equalizer bars pulsing in `--accent` (mauve)
- Always visible as the user scrolls through the page

**Expanded state**
- Triggered by clicking the collapsed button
- A card animates open above/around the button, ~300px wide × 152px tall (Spotify compact iframe height)
- Contains the Spotify embed iframe
- A small `×` close button in the top-right corner collapses it back

**Page load**
- The collapsed button slides in from the right with `back.out` easing after a short delay (after hero animations settle)

## Embed

Playlist ID: `4FuLyaBxcwkCWC6o53J6FR`

Embed URL:
```
https://open.spotify.com/embed/playlist/4FuLyaBxcwkCWC6o53J6FR?utm_source=generator&theme=0
```

Spotify's `theme=0` applies dark styling. The iframe is set to `width="100%" height="152"` within the card container.

## Animation

All animations use GSAP:

| Trigger | Animation |
|---|---|
| Page load | Button slides in from right: `x: 80 → 0`, `opacity: 0 → 1`, `ease: back.out(1.7)`, `delay: 2` |
| Open click | Card: `scaleY: 0 → 1`, `opacity: 0 → 1`, `transformOrigin: bottom right`, `duration: 0.35`, `ease: back.out(1.4)` |
| Close click | Card: reverse — `scaleY: 1 → 0`, `opacity: 1 → 0`, `duration: 0.25`, `ease: power2.in` |

## Styling

Uses existing CSS custom properties from `src/index.css`:

| Property | Value |
|---|---|
| Background | `--bg-2` (`#181825`) |
| Border | `1px solid var(--border)` with `--accent` tint on hover |
| Border radius | `12px` (card), `999px` (collapsed button) |
| Button color | `--accent` (mauve `#cba6f7`) |
| Box shadow | `0 8px 32px rgba(0,0,0,0.4)` |
| z-index | `100` (above all content, below cursor overlay) |

The Cursor component sits at `z-index: 9999`, so the player will be beneath it — correct.

## Components

**New files:**
- `src/components/SpotifyPlayer.jsx` — state (open/closed), GSAP animations, iframe embed
- `src/components/SpotifyPlayer.module.css` — fixed positioning, collapsed button, expanded card styles

**Modified files:**
- `src/App.jsx` — import and render `<SpotifyPlayer />` alongside `<Cursor />`

## Constraints

- No backend, no OAuth, no Spotify API calls
- Pure iframe embed — Spotify controls playback
- Works on any static host (GitHub Pages)
- The iframe is sandboxed by Spotify; no JS communication possible
- On touch devices the custom cursor is hidden but the player still renders and functions normally
