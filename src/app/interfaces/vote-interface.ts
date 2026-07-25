/**
 * @description Represents a vote cast by a user for a specific answer to a survey question.
 */
export interface Vote {
    id: number;
    question_id: number;
    answer_id: number;
    voter_token: string;
}