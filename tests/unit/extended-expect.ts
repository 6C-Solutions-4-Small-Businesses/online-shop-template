expect.extend({
    thatFetchRequestOptionsContainsFormData(parameters: RequestInit, key: string, value: string) {
        // ----------------------------194514675662123639591691
        // Content-Disposition: form-data; name="{the-key}"
        //
        // {the-value}
        // ----------------------------194514675662123639591691--
        return {
            pass: parameters.body !== null && parameters.body !== undefined &&
                parameters.body.toString().includes(`name="${key}"`) &&
                parameters.body.toString().includes(value),
            message: () => `body did not contain "${key}" form data`,
        }
    }
})

export const customExpect = expect
