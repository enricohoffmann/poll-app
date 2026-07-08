import { AbstractControl } from "@angular/forms";
import { VALIDATION_MESSAGES } from "./validation-messages";

export function getDateFromGermanDate(dateValue: string): Date {
    const [day, month, year] = dateValue.split('.').map(Number);
    return new Date(year, month - 1, day);
}

export function checkDateInGermanFormat(dateValue: string): boolean {
    const [day, month, year] = dateValue.split('.').map(Number);
    const date = new Date(year, month-1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}
