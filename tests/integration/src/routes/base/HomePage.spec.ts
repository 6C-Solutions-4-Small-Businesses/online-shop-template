import {expect, type Locator, test} from '@playwright/test'
import {
    DOUBLE_XL_SCREEN_SIZE,
    LG_SCREEN_SIZE,
    MD_SCREEN_SIZE,
    SM_SCREEN_SIZE,
    TRIPLE_XL_SCREEN_SIZE,
    XL_SCREEN_SIZE
} from '../../../../../config/ScreenSizeConfig'
import {scroll} from '../../../../Utils'

const HOME_PAGE_URL: string = '/'

test.describe('Home page breakpoints visual comparison', () => {
    test('should match screenshot for sm screen size', async ({page}) => {
        await page.setViewportSize({
            width: SM_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`sm-screenshot.png`, {
            fullPage: true
        })
    })

    test('should match screenshot for page with drawer sm screen size', async ({page}) => {
        await page.setViewportSize({
            width: SM_SCREEN_SIZE,
            height: 1300
        })
        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        const button: Locator = page.getByTestId('menu-toggle-button')
        await button.click()

        await expect(page).toHaveScreenshot(`sm-drawer-screenshot.png`, {
            fullPage: true
        })
    })

    test('should match screenshot for page with drawer and display identification modal sm screen size', async ({
                                                                                                                    page
                                                                                                                }) => {
        await page.setViewportSize({
            width: SM_SCREEN_SIZE,
            height: 1300
        })
        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)
        const menuButton: Locator = page.getByTestId('menu-toggle-button')
        await menuButton.click()

        const userProfileButton: Locator = page.getByTestId('user-profile-drawer-button')
        await userProfileButton.click()

        await expect(page).toHaveScreenshot(`sm-drawer-identification-modal-screenshot.png`, {
            fullPage: true
        })
    })

    test('md visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: MD_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`md-screenshot.png`, {
            fullPage: true
        })
    })

    test('should match screenshot for page and display identification modal md screen size', async ({
                                                                                                        page
                                                                                                    }) => {
        await page.setViewportSize({
            width: MD_SCREEN_SIZE,
            height: 1300
        })
        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        const userProfileButton: Locator = page.getByTestId('user-profile-button')
        await userProfileButton.click()

        await expect(page).toHaveScreenshot(`md-drawer-identification-modal-screenshot.png`, {
            fullPage: true
        })
    })

    test('lg visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: LG_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`lg-screenshot.png`, {
            fullPage: true
        })
    })

    test('should match screenshot for page and display identification modal lg screen size', async ({
                                                                                                        page
                                                                                                    }) => {
        await page.setViewportSize({
            width: LG_SCREEN_SIZE,
            height: 1300
        })
        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        const userProfileButton: Locator = page.getByTestId('user-profile-button')
        await userProfileButton.click()

        await expect(page).toHaveScreenshot(`lg-drawer-identification-modal-screenshot.png`, {
            fullPage: true
        })
    })

    test('xl visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: XL_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`xl-screenshot.png`, {
            fullPage: true
        })
    })

    test('should match screenshot for page and display identification modal xl screen size', async ({
                                                                                                        page
                                                                                                    }) => {
        await page.setViewportSize({
            width: XL_SCREEN_SIZE,
            height: 1300
        })
        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        const userProfileButton: Locator = page.getByTestId('user-profile-button')
        await userProfileButton.click()

        await expect(page).toHaveScreenshot(`xl-drawer-identification-modal-screenshot.png`, {
            fullPage: true
        })
    })

    test('2xl visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: DOUBLE_XL_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`2xl-screenshot.png`, {
            fullPage: true
        })
    })

    test('should match screenshot for page and display identification modal 2xl screen size', async ({
                                                                                                         page
                                                                                                     }) => {
        await page.setViewportSize({
            width: DOUBLE_XL_SCREEN_SIZE,
            height: 1300
        })
        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        const userProfileButton: Locator = page.getByTestId('user-profile-button')
        await userProfileButton.click()

        await expect(page).toHaveScreenshot(`2xl-drawer-identification-modal-screenshot.png`, {
            fullPage: true
        })
    })

    test('3xl visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: TRIPLE_XL_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`3xl-screenshot.png`, {
            fullPage: true
        })
    })

    test('should match screenshot for page and display identification modal 3xl screen size', async ({
                                                                                                         page
                                                                                                     }) => {
        await page.setViewportSize({
            width: TRIPLE_XL_SCREEN_SIZE,
            height: 1300
        })
        await page.goto(HOME_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        const userProfileButton: Locator = page.getByTestId('user-profile-button')
        await userProfileButton.click()

        await expect(page).toHaveScreenshot(`3xl-drawer-identification-modal-screenshot.png`, {
            fullPage: true
        })
    })
})
