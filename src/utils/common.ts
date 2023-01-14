export const getHashUrlFromUrl = (url: string) => {
    try {
        const urlObj = new URL(url);

        return urlObj.hash.slice(1);
    } catch (e) {
        return '';
    }
};