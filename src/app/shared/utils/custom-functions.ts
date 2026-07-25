
/**
 * @description Converts a date string in German format (DD.MM.YYYY) to a JavaScript Date object.
 * @param dateValue The date string in German format (DD.MM.YYYY).
 * @returns {Date} The corresponding JavaScript Date object.
 */
export function getDateFromGermanDate(dateValue: string): Date {
    const [day, month, year] = dateValue.split('.').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * @description Checks if a date string is in German format (DD.MM.YYYY) and represents a valid date.
 * @param dateValue The date string in German format (DD.MM.YYYY).
 * @returns {boolean} True if the date string is valid, false otherwise.
 */
export function checkDateInGermanFormat(dateValue: string): boolean {
    const [day, month, year] = dateValue.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}

/**
 * @description Converts a date string in German format (DD.MM.YYYY) to an ISO date string (YYYY-MM-DD).
 * @param dateValue The date string in German format (DD.MM.YYYY).
 * @returns {string} The corresponding ISO date string (YYYY-MM-DD).
 */
export function getIsoDateFromGermanDate(dateValue: string): string {
    const [day, month, year] = dateValue.split('.').map(Number);
    return`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

