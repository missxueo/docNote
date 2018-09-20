type ReadonlyArr<T> = {
    readonly [P in keyof T]: T[P];
}