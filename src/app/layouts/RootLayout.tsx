/**
 * 루트 레이아웃 — Konsta Tabbar 네비게이션.
 * Root layout with Konsta Tabbar navigation.
 */
import { useState, useCallback } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import { Tabbar, TabbarLink } from "konsta/react";
import { cn } from "../../lib/cn";

/** Click a data-label element to copy its label to clipboard */
function handleLabelClick(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest("[data-label]");
  if (!el || !(el instanceof HTMLElement)) return;

  const label = el.dataset.label;
  if (!label) return;

  e.preventDefault();
  e.stopPropagation();

  navigator.clipboard.writeText(label).then(() => {
    el.classList.add("label-copied");
    setTimeout(() => el.classList.remove("label-copied"), 800);
  });
}

function DevLabelToggle() {
  const [on, setOn] = useState(false);
  const toggle = useCallback(() => {
    setOn((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("show-labels", next);

      // Add/remove click-to-copy listener
      if (next) {
        document.addEventListener("click", handleLabelClick, true);
      } else {
        document.removeEventListener("click", handleLabelClick, true);
      }
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      style={{
        position: "fixed", top: 6, right: 6, zIndex: 99999,
        fontSize: 10, padding: "3px 8px",
        background: on ? "#7C3AED" : "#9CA3AF",
        color: "#fff", border: "none", borderRadius: 6,
        opacity: 0.85, fontFamily: "monospace",
      }}
    >
      {on ? "LABELS ON" : "LABELS"}
    </button>
  );
}

interface TabItem {
  to: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const tabs: TabItem[] = [
  {
    to: "/",
    label: "뉴스",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" />
      </svg>
    ),
  },
  {
    to: "/reports",
    label: "리포트",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    to: "/community",
    label: "커뮤니티",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/calendar",
    label: "캘린더",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "내 정보",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function RootLayout() {
  const location = useLocation();

  return (
    <div className="flex h-[100dvh] flex-col bg-surface safe-area-top overflow-hidden">
      {/* Skip to content link for keyboard users (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[99999] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        본문으로 건너뛰기
      </a>

      {import.meta.env.DEV && <DevLabelToggle />}
      <main id="main-content" className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y" style={{ paddingBottom: "max(5rem, calc(5rem + env(safe-area-inset-bottom, 0px)))" }}>
        <div className="mx-auto max-w-lg px-4 py-4">
          <Outlet />
        </div>
      </main>

      <Tabbar
        labels
        className={cn(
          "fixed! bottom-0 left-0 right-0 z-50 border-t glass-panel-heavy safe-area-bottom",
        )}
      >
        {tabs.map((tab) => {
          const tabKey = tab.to === "/" ? "home" : tab.to.slice(1);
          const isActive = tab.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(tab.to);
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              data-label={`app.rootLayout.tab.${tabKey}`}
              aria-label={tab.label}
            >
              <TabbarLink
                active={isActive}
                label={<span className="text-[11px]">{tab.label}</span>}
                icon={
                  <span aria-hidden="true">{tab.icon(isActive)}</span>
                }
                className={cn(
                  "min-h-[48px] transition-all duration-300 active:scale-[0.93]",
                  isActive ? "text-brand" : "text-ink-muted",
                )}
              />
            </NavLink>
          );
        })}
      </Tabbar>
    </div>
  );
}
