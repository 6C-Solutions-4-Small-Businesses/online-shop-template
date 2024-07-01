import {expect, type Locator, test} from '@playwright/test'
import {
    DOUBLE_XL_SCREEN_SIZE,
    LG_SCREEN_SIZE,
    MD_SCREEN_SIZE,
    SM_SCREEN_SIZE,
    TRIPLE_XL_SCREEN_SIZE,
    XL_SCREEN_SIZE,
} from '../../../../../config/ScreenSizeConfig'
import {afterAll} from 'vitest'

const CONTACT_US_PAGE_URL: string = '/contact'

test.beforeAll(() => {
    localStorage.setItem('showCookiesDisclaimer', JSON.stringify(false))
})

test.describe('Home page terms and conditions breakpoints visual comparison', () => {


    test('should match screenshot for sm screen size', async ({page}) => {
        await page.setViewportSize({
            width: SM_SCREEN_SIZE,
            height: 1300,
        })
        await page.goto(CONTACT_US_PAGE_URL, {waitUntil: 'load'})

        const termsAndConditionButton: Locator = page.getByTestId('terms-and-condition-button')
        await termsAndConditionButton.click()

        await expect(page).toHaveScreenshot(`sm-screenshot.png`, {
            fullPage: true,
        })
    })

    test('should match screenshot for md screen size', async ({page}) => {
        await page.setViewportSize({
            width: MD_SCREEN_SIZE,
            height: 1300,
        })
        await page.goto(CONTACT_US_PAGE_URL, {waitUntil: 'load'})

        const termsAndConditionButton: Locator = page.getByTestId('terms-and-condition-button')
        await termsAndConditionButton.click()

        await expect(page).toHaveScreenshot(`md-screenshot.png`, {
            fullPage: true,
        })
    })

    test('should match screenshot for lg screen size', async ({page}) => {
        await page.setViewportSize({
            width: LG_SCREEN_SIZE,
            height: 1300,
        })
        await page.goto(CONTACT_US_PAGE_URL, {waitUntil: 'load'})

        const termsAndConditionButton: Locator = page.getByTestId('terms-and-condition-button')
        await termsAndConditionButton.click()

        await expect(page).toHaveScreenshot(`lg-screenshot.png`, {
            fullPage: true,
        })
    })

    test('should match screenshot for xl screen size', async ({page}) => {
        await page.setViewportSize({
            width: XL_SCREEN_SIZE,
            height: 1300,
        })
        await page.goto(CONTACT_US_PAGE_URL, {waitUntil: 'load'})

        const termsAndConditionButton: Locator = page.getByTestId('terms-and-condition-button')
        await termsAndConditionButton.click()

        await expect(page).toHaveScreenshot(`xl-screenshot.png`, {
            fullPage: true,
        })
    })

    test('should match screenshot for 2xl screen size', async ({page}) => {
        await page.setViewportSize({
            width: DOUBLE_XL_SCREEN_SIZE,
            height: 1300,
        })
        await page.goto(CONTACT_US_PAGE_URL, {waitUntil: 'load'})

        const termsAndConditionButton: Locator = page.getByTestId('terms-and-condition-button')
        await termsAndConditionButton.click()

        await expect(page).toHaveScreenshot(`2xl-screenshot.png`, {
            fullPage: true,
        })
    })

    test('should match screenshot for 3xl screen size', async ({page}) => {
        await page.setViewportSize({
            width: TRIPLE_XL_SCREEN_SIZE,
            height: 1300,
        })
        await page.goto(CONTACT_US_PAGE_URL, {waitUntil: 'load'})

        const termsAndConditionButton: Locator = page.getByTestId('terms-and-condition-button')
        await termsAndConditionButton.click()

        await expect(page).toHaveScreenshot(`3xl-screenshot.png`, {
            fullPage: true,
        })
    })

})

test.afterAll(async () => {
    localStorage.removeItem('showCookiesDisclaimer')
})
