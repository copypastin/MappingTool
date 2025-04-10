// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: '100%',
    reporter: 'html',
    use: {
        trace: 'on-first-retry',

    },
    timeout: 19_000,
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },

        },
    ],

});

