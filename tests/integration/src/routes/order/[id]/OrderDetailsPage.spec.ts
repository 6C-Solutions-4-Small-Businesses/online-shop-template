import {expect, test} from '@playwright/test'
import {
    DOUBLE_XL_SCREEN_SIZE,
    LG_SCREEN_SIZE,
    MD_SCREEN_SIZE,
    SM_SCREEN_SIZE,
    TRIPLE_XL_SCREEN_SIZE,
    XL_SCREEN_SIZE
} from '../../../../../../config/ScreenSizeConfig'
import {scroll} from '../../../../../Utils'

const ORDER_DETAIL_PAGE_URL = '/order/f7732aa0-cf72-4cc0-ab14-0ab001360bf9'

test.describe('Order Details page breakpoints visual comparison', () => {
    test('should match screenshot for sm screen size', async ({page}) => {
        await page.setViewportSize({
            width: SM_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(ORDER_DETAIL_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`sm-screenshot.png`, {
            fullPage: true
        })
    })

    test('md visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: MD_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(ORDER_DETAIL_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`md-screenshot.png`, {
            fullPage: true
        })
    })

    test('lg visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: LG_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(ORDER_DETAIL_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`lg-screenshot.png`, {
            fullPage: true
        })
    })

    test('xl visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: XL_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(ORDER_DETAIL_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`xl-screenshot.png`, {
            fullPage: true
        })
    })

    test('2xl visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: DOUBLE_XL_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(ORDER_DETAIL_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`2xl-screenshot.png`, {
            fullPage: true
        })
    })

    test('3xl visual comparison', async ({page}) => {
        await page.setViewportSize({
            width: TRIPLE_XL_SCREEN_SIZE,
            height: 1300
        })

        await page.goto(ORDER_DETAIL_PAGE_URL, {waitUntil: 'load'})
        await scroll(page)

        await expect(page).toHaveScreenshot(`3xl-screenshot.png`, {
            fullPage: true
        })
    })
})
