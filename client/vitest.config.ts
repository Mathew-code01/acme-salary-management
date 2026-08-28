import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: false,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
  },
});
