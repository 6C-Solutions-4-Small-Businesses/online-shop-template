export async function throttle<T>(func: (...args: any) => T, delay: number): Promise<(...args: any) => void> {
    let lastFunc: NodeJS.Timeout
    let lastRan =  Date.now()
    return async function (...args) {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(async function () {
            if ((Date.now() - lastRan) >= delay) {
                await func(...args)
                lastRan = Date.now()
            }
        }, delay)
    }
}
