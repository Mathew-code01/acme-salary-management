import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',

    globals: false,

    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    include: ['tests/**/*.test.ts'],

    exclude: ['node_modules', 'dist', 'coverage'],

    testTimeout: 10_000,
    hookTimeout: 10_000,

    coverage: {
      provider: 'v8',

      reporter: ['text', 'json', 'html'],

      reportsDirectory: './coverage',

      exclude: ['src/generated/**', 'src/**/index.ts', 'src/server.ts'],
    },
  },

  resolve: {
    extensions: ['.ts', '.js', '.mts', '.mjs'],
  },
});
