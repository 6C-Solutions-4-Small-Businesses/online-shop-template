import {devices, type PlaywrightTestConfig} from '@playwright/test'

const config: PlaywrightTestConfig = {
    webServer: {
        command: 'npm run preview',
        port: 4173,
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
    timeout: 30000,
}

export default config;
