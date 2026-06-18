import { Question } from "../interfaces/question-interface";


export class QuestionModel implements Question {
    id: number;
    survey_id: number;
    text: string;
    allow_multiple_answers: boolean;
    sort_order: number;

    constructor(questionData: Partial<Question> = {}, surveyId: number) {
        this.id = questionData.id ?? 0;
        this.survey_id = surveyId;
        this.text = questionData.text ?? '';
        this.allow_multiple_answers = questionData.allow_multiple_answers ?? false;
        this.sort_order = questionData.sort_order ?? 0;
    }

    getCleanAddSurveyJson(): {} {
        return {
            survey_id: this.survey_id,
            text: this.text,
            allow_multiple_answers: this.allow_multiple_answers,
            sort_order: this.sort_order
        };
    }
}