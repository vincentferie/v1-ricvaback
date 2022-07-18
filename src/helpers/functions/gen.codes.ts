export function genCode(size: number) {
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allUniqueChars = [..."~!@#$%^&*()_+-=[]\{}|/<>?"];
    const allNumbers = [..."0123456789"];

    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha, ...allUniqueChars];

    const generator = (base, len) => {
        return [...Array(len)]
            .map(i => base[Math.random() * base.length | 0])
            .join('');
    };
    return generator(base, size)
}
