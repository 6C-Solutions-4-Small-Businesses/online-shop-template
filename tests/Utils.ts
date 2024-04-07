import fs from 'fs'
import path from 'path'
import type {Page} from 'playwright-core'

export function doesFileExist(dir: string, fileName: string): boolean {
    const files = fs.readdirSync(dir)

    for (const file of files) {
        const filePath = path.join(dir, file)

        if (!fs.statSync(filePath).isDirectory() && file === fileName) {
            return true
        }
    }

    return false
}

export async function scroll(page: Page) {
    return await page.evaluate(async () => {
        return await new Promise((resolve, reject) => {
            var i = setInterval(() => {
                window.scrollBy(0, window.innerHeight)
                if (
                    document.scrollingElement != null &&
                    document.scrollingElement?.scrollTop + window.innerHeight >=
                    document.scrollingElement?.scrollHeight
                ) {
                    window.scrollTo(0, 0)
                    clearInterval(i)
                    resolve('')
                }
            }, 100)
        })
    })
}
