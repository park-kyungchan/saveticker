/**
 * Android hardware back button handler for Capacitor.
 * 안드로이드 하드웨어 뒤로가기 버튼 처리.
 *
 * Without this, pressing back exits the app from every screen because
 * the native BridgeActivity calls finish() before the WebView can
 * consume the event via browser history.
 */
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

/** Tab root paths where back should minimize instead of navigate */
const TAB_ROOTS = new Set(["/", "/reports", "/community", "/calendar", "/profile"]);

export function useAndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = App.addListener("backButton", ({ canGoBack }) => {
      if (TAB_ROOTS.has(location.pathname)) {
        // On a tab root — minimize app instead of exiting
        App.minimizeApp();
      } else if (canGoBack) {
        // Detail page — go back in browser history
        navigate(-1);
      } else {
        // No history left — minimize
        App.minimizeApp();
      }
    });

    return () => {
      listener.then((h) => h.remove());
    };
  }, [location.pathname, navigate]);
}
