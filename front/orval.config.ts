import { defineConfig } from 'orval';

export default defineConfig({
  dashboard: {
    input: {
      target: 'http://localhost:3000/doc',
    },
    output: {
      mode: 'single',
      target: './src/api/dashboard.ts',
      client: 'fetch',
      mock: false,
      override: {
        mutator: {
          path: './orvalOverride.ts',
          name: 'customFetch',
        },
      },
    },
  },
});