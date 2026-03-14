# Plan: Fix Android/iOS Hardware Back Button Closing App

## Context

When a user taps a news article to open the detail page (`/news/:id`) and then presses the Android hardware back button (or iOS programmatic back), the **app closes entirely** instead of navigating back to the news feed.

**Root cause**: Two compounding issues:
1. `BrowserRouter` uses `history.pushState()` which does NOT create WebView navigation entries — the WebView sees all SPA navigation as a single "page". When Android back fires, `webView.canGoBack()` returns `false`, so the Activity finishes.
2. `@capacitor/app` plugin is **not installed** — there is no way to intercept the hardware back button event before the default (close app) behavior kicks in.

## Fix (3 files)

### Step 1: Install `@capacitor/app`

```bash
bun add @capacitor/app@^8
```

Capacitor 8 auto-discovers plugins — no changes to `MainActivity.java` or `capacitor.config.ts` needed.

### Step 2: Create `src/hooks/useHardwareBack.ts`

New hook that intercepts Android hardware back via `App.addListener('backButton')`:

- **Detail pages** (`/news/:id`, any non-root path): call `navigate(-1)` — same as the software `BackButton` component
- **Root tab pages** (`/`, `/reports`, `/community`, `/calendar`, `/profile`): call `App.minimizeApp()` — matches Android platform convention (background, not kill)
- **Web**: no-op via `Capacitor.isNativePlatform()` guard
- **iOS**: listener registers but event never fires (iOS swipe-back is native WebView behavior) — harmless

Patterns to reuse:
- `var` module-level cache for dynamic import (from `src/stores/feedStore.ts:13`)
- `Capacitor.isNativePlatform()` guard (from `src/lib/haptics.ts:8`)

### Step 3: Register in `src/app/layouts/RootLayout.tsx`

Add single `useHardwareBack()` call inside the `RootLayout` component. This wraps all routes (tabs + detail), so one registration covers every screen.

```diff
+ import { useHardwareBack } from "../../hooks/useHardwareBack";

  export function RootLayout() {
    const location = useLocation();
+   useHardwareBack();
```

### Step 4: Cap sync

```bash
bunx cap sync
```

Registers the new `@capacitor/app` plugin in the Android native project.

## Files

| File | Action |
|------|--------|
| `package.json` | `bun add @capacitor/app@^8` |
| `src/hooks/useHardwareBack.ts` | NEW — hardware back interception hook |
| `src/app/layouts/RootLayout.tsx` | EDIT — import + call `useHardwareBack()` |

## Verification

```bash
bun run typecheck    # 0 errors
bun run build        # dist/ produced
bunx cap sync        # 5 plugins (haptics, keyboard, preferences, status-bar, app)
```

Then `/rebuild --publish` for device testing:
- Android detail page → hardware back → returns to feed (not app close)
- Android root tab → hardware back → app minimizes (not close)
- Web → no regressions, software BackButton still works
