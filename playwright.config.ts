import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['@artilleryio/playwright-reporter', { name: 'My Tests' }]],
});