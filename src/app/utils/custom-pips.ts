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