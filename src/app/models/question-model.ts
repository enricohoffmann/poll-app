import { Question } from "../interfaces/question-interface";

/**
 * @description Represents a survey question with additional methods for handling question data.
 * @implements {Question}
 */
export class QuestionModel implements Question {
    id: number;
    survey_id: number;
    text: string;
    allow_multiple_answers: boolean;
    sort_order: number;

    /**
     * Creates an instance of QuestionModel.
     *
     * @param questionData - Partial data for the question.
     * @param surveyId - The ID of the survey this question belongs to.
     */
    constructor(questionData: Partial<Question> = {}, surveyId: number) {
        this.id = questionData.id ?? 0;
        this.survey_id = surveyId;
        this.text = questionData.text ?? '';
        this.allow_multiple_answers = questionData.allow_multiple_answers ?? false;
        this.sort_order = questionData.sort_order ?? 0;
    }

    /**
     * Returns a JSON representation of the question suitable for adding a survey.
     *
     * @returns {object} The JSON representation of the question.
     */
    getCleanAddSurveyJson(): {} {
        return {
            survey_id: this.survey_id,
            text: this.text,
            allow_multiple_answers: this.allow_multiple_answers,
            sort_order: this.sort_order
        };
    }
}