export function getValueOrThrowIfFalsy<T>(arg: T | null): T {
    if (!arg) {
        throw 'argument is falsy';
    }

    return arg;
}
