import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.saveticker.prototype",
  appName: "SaveTicker",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    StatusBar: { style: "dark", backgroundColor: "#0a0a0f" },
    Keyboard: { resize: "none", style: "dark" },
  },
};

export default config;
