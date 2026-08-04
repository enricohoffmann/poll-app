import {Pipe, PipeTransform} from '@angular/core';

/**
 * @description This pipe is used to transform the number of days until expiry into a human-readable string.
 * @implements {PipeTransform}
 * @returns {string} A string representing the number of days until expiry.
 */
@Pipe({
    name: 'expiryViewChange',
})
export class ExpiryViewChange implements PipeTransform {
    transform(days: number): string {
        if(days === 1) {return `Ends in 1 Day`;}
        if(days > 1) {return `Ends in ${days} Days`;}
        if(days === 0) {return 'Ends today';}
        if(days === -1) {return `Ends 1 Day ago`;}
        if(days < -1) {return `Ends ${Math.abs(days)} Days ago`;}
        return '';
    }
}

/**
 * @description This pipe is used to transform an ISO date string into a German date format (DD.MM.YYYY).
 * @implements {PipeTransform}
 * @returns {string} A string representing the date in German format.
 */
@Pipe({
    name: 'isoDateToGerman'
})
export class IsoDateToGerman implements PipeTransform {
    transform(dateValue: string | undefined | null): string {
        if(!dateValue) { return '';}
        if(dateValue.length === 0) { return '';}
        const [year, month, day] = dateValue.split('-');
        return `${day}.${month}.${year}`;
    }
}

/**
 * @description This pipe is used to round a number to the nearest integer.
 * @implements {PipeTransform}
 * @returns {number} The rounded integer value.
 */
@Pipe({
    name: 'resultRounding'
})
export class ResultRounding implements PipeTransform {
    transform(unroundedValue: number | null | undefined): number {
        if(!unroundedValue) {return 0;}
        return Math.round(unroundedValue);
    }
}