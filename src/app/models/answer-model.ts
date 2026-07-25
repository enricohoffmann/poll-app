import { Answer } from "../interfaces/answer-interface";

/**
 * @description Represents an answer to a survey question.
 * @implements {Answer}
 */
export class AnswerModel implements Answer {
    id: number;
    question_id: number;
    text: string;
    sort_order: number;

    /**
     * Creates an instance of AnswerModel.
     *
     * @param answerData - Partial data for the answer.
     * @param questionId - The ID of the question this answer belongs to.
     */
    constructor(answerData: Partial<Answer> = {}, questionId: number){
        this.id = answerData.id ?? 0;
        this.question_id = questionId;
        this.text = answerData.text ?? '';
        this.sort_order = answerData.sort_order ?? 0;
    }

    /**
     * Returns a JSON representation of the answer suitable for adding a survey.
     *
     * @returns {object} The JSON representation of the answer.
     */
    getCleanAddSurveyJson(): {} {
        return {
            question_id: this.question_id,
            text: this.text,
            sort_order: this.sort_order
        };
    }
}