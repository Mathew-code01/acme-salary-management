import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,

    environment: 'jsdom',

    setupFiles: ['./src/test/setup.ts'],

    css: true,

    clearMocks: true,

    restoreMocks: true,

    mockReset: true,

    coverage: {
      provider: 'v8',

      reporter: ['text', 'json', 'html'],

      reportsDirectory: './coverage',

      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },

      exclude: ['src/test/**', '**/*.d.ts', '**/main.tsx', '**/vite-env.d.ts'],
    },
  },
});
