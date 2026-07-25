import { Injectable } from "@angular/core";

/**
 * This service provides a mapping between answer indices and their corresponding identifiers (A, B, C, D, E, F).
 * It is used to retrieve the identifier for a given answer index.
 * @example
 * const identifier = answerIdentifierService.getIdentifier(0); // Returns 'A'
 */
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

    /**
     * Retrieves the identifier for the given answer index.
     * @param index - The index of the answer (0-5).
     * @returns {string} The corresponding answer identifier (A-F).
     */
    getIdentifier(index: number): string {
        return this.ANSWER_IDENTIFIER[index];
    }
}