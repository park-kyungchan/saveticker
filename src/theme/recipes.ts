/**
 * Glassmorphic (Dark) -- Component-level style recipes for SaveTicker.
 * To switch themes: replace this file + globals.css @theme/@layer base.
 */
import type { ThemeRecipes } from "./types";

export const recipes: ThemeRecipes = {
  name: "glassmorphic",

  stat: {
    container: "rounded-xl border glass-panel p-4 text-center shadow-md",
    valueColors: ["text-accent-1", "text-brand", "text-accent-3"],
    valueClass: "text-[28px] font-display font-light",
    labelClass: "mt-1 text-[11px] uppercase tracking-wide text-ink-muted",
  },

  avatar: {
    shape: "rounded-full",
    size: "size-10",
    strategy: "gradient",
    colors: [
      "bg-gradient-to-br from-brand to-accent-1",
      "bg-gradient-to-br from-accent-2 to-accent-1",
      "bg-gradient-to-br from-accent-3 to-brand",
      "bg-gradient-to-br from-accent-4 to-danger",
      "bg-gradient-to-br from-accent-5 to-accent-2",
    ],
    textClass: "text-sm font-semibold text-white",
  },

  sectionTitle: "text-base font-display font-normal text-ink/85",

  card: {
    base: "rounded-xl border glass-panel p-5 shadow-md",
    hover: "hover:border-white/25 hover:shadow-lg transition-all",
  },

  listRow: {
    container:
      "flex items-center gap-3 rounded-xl border glass-panel p-4 shadow-sm",
    nameClass: "text-sm font-medium text-ink",
    metaClass: "mt-0.5 text-xs text-ink-muted",
    interactive: "active:bg-white/5",
  },

  statusDot: {
    base: "inline-block size-2.5 rounded-full border",
    colors: {
      active: "bg-success",
      inactive: "bg-warning",
      rising: "bg-success",
      falling: "bg-danger",
      neutral: "bg-ink-muted",
    },
  },

  severityBadge: {
    base: "inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase",
    variants: {
      critical: "bg-danger/15 border-danger/30 text-danger",
      warning: "bg-warning/15 border-warning/30 text-warning",
      info: "bg-info/15 border-info/30 text-info",
      success: "bg-success/15 border-success/30 text-success",
    },
  },

  priceChange: {
    up: "text-success",
    down: "text-danger",
    neutral: "text-ink-muted",
  },
};
