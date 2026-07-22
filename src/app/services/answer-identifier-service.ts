import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class AnswerIdentifierService {
    private readonly ANSWER_IDENTIFIER: Record<number, string> = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F'
    };

    getIdentifier(index: number): string {
        return this.ANSWER_IDENTIFIER[index];
    }
}