import { defineConfig } from '@playwright/test';
import path from 'path';

const prototypeDir = path.resolve(__dirname, '_bmad-output/D-Prototypes');
const PROTO_PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npx serve "${prototypeDir}" -l ${PROTO_PORT} --no-clipboard`,
    port: PROTO_PORT,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'prototype-mobile-se',
      testMatch: 'prototype/**/*.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true,
        baseURL: `http://localhost:${PROTO_PORT}`,
      },
    },
    {
      name: 'prototype-mobile-14',
      testMatch: 'prototype/**/*.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: { width: 393, height: 852 },
        isMobile: true,
        hasTouch: true,
        baseURL: `http://localhost:${PROTO_PORT}`,
      },
    },
    {
      name: 'prototype-mobile-14max',
      testMatch: 'prototype/**/*.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: { width: 428, height: 926 },
        isMobile: true,
        hasTouch: true,
        baseURL: `http://localhost:${PROTO_PORT}`,
      },
    },
    // Future: app e2e tests
    // {
    //   name: 'app-mobile',
    //   testMatch: 'app/**/*.spec.ts',
    //   use: {
    //     browserName: 'chromium',
    //     viewport: { width: 393, height: 852 },
    //     isMobile: true,
    //     hasTouch: true,
    //     baseURL: 'http://localhost:3000',
    //   },
    // },
  ],
});
