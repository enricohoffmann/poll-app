
export function getDateFromGermanDate(dateValue: string): Date {
    const [day, month, year] = dateValue.split('.').map(Number);
    return new Date(year, month - 1, day);
}