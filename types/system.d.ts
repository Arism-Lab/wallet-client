type Concat<T> = T extends [infer A, ...infer Rest] ? (A extends any[] ? [...A, ...Concat<Rest>] : A) : T

type ExactKeys<T, K extends keyof any> = T & {
    [P in keyof T]: P extends K ? T[P] : never
} & {
    [P in K]: P extends keyof T ? T[P] : never
}

type TypeEqualityGuard<A, B> = Exclude<A, B> | Exclude<B, A>
