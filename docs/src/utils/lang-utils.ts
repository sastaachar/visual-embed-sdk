import en from '../intl/en.json';
/**
 * Used to get string translation based on slag_id and selected language.
 * @param {string} slag_id - string_id or slag_id to get translations
 * @returns {string} string translation based on currently selected language and slag_id
 */
export const t = (slag_id: string) => {
    return en[slag_id];
};

export default t;
