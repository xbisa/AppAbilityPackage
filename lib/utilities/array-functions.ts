export const includesAny = (arr: string[], values: string[]) => {
    return Array.isArray(arr) ? values.some(v => arr.includes(v)) : false;
}

export const includes = (arr: string[], value: string) => {
    return Array.isArray(arr) ? arr.includes(value) : false;
}