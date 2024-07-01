import {devices, type PlaywrightTestConfig} from '@playwright/test'

const config: PlaywrightTestConfig = {
    webServer: {
        command: 'npm run dev',
        port: 5173,
        timeout: 600000,
        stdout: 'pipe',
        stderr: 'pipe',
    },
    testDir: 'tests/integration',
    testMatch: /(.+\.)?(test|spec)\.[jt]s/,
    workers: '50%',
    projects: [
        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']}
        }
    ],
    timeout: 60000,
}

export default config;
