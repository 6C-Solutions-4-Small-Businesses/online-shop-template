export class Email {
    private constructor(
        public value: string,
    ) {
    }

    public static create(value: string): Email {
        return new Email(value)
    }
}

export class PhoneNumber {
    private constructor(
        public value: string,
    ) {
    }

    public static create(value: string) {
        return new PhoneNumber(value)
    }
}

export type FindUserRequest = Email | PhoneNumber
