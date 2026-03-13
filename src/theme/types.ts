/**
 * Component-level style recipes extracted from theme HTML previews.
 * Bridges the gap between CSS tokens (@theme) and React component classes.
 * Switch themes by replacing this file + globals.css tokens.
 */

export interface ThemeRecipes {
  /** Template identifier */
  name: string;

  /** Dashboard stat cards */
  stat: {
    container: string;
    valueColors: [string, string, string];
    valueClass: string;
    labelClass: string;
  };

  /** User/stock avatars */
  avatar: {
    shape: string;
    size: string;
    strategy: "gradient" | "solid" | "tinted" | "bordered";
    colors: string[];
    textClass: string;
  };

  /** Section heading */
  sectionTitle: string;

  /** Card/panel container */
  card: {
    base: string;
    hover: string;
  };

  /** List item row */
  listRow: {
    container: string;
    nameClass: string;
    metaClass: string;
    interactive: string;
  };

  /** Status indicator dot */
  statusDot: {
    base: string;
    colors: Record<string, string>;
  };

  /** Severity badges */
  severityBadge: {
    base: string;
    variants: Record<string, string>;
  };

  /** Price change indicator */
  priceChange: {
    up: string;
    down: string;
    neutral: string;
  };
}
