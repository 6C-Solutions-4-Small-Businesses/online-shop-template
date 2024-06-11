export function throttle<T>(func: (...args: any) => T, delay: number): (...args: any) => void {
    let lastFunc: NodeJS.Timeout
    let lastRan: number =  Date.now()
    return function (...args) {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(function () {
            if ((Date.now() - lastRan) >= delay) {
                func(...args)
                lastRan = Date.now()
            }
        }, delay)
    }
}
