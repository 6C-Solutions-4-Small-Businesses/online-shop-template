interface CustomMatchers<R = unknown> {
    thatFetchRequestOptionsContainsFormData(key, value): R
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> {
    }

    interface AsymmetricMatchersContaining extends CustomMatchers {
    }
}
