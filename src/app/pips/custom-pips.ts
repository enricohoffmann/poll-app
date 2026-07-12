import {Pipe, PipeTransform} from '@angular/core';

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