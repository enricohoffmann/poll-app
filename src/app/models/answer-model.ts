import { Answer } from "../interfaces/answer-interface";


export class AnswerModel implements Answer {
    id: number;
    question_id: number;
    text: string;
    sort_order: number;

    constructor(answerData: Partial<Answer> = {}, questionId: number){
        this.id = answerData.id ?? 0;
        this.question_id = questionId;
        this.text = answerData.text ?? '';
        this.sort_order = answerData.sort_order ?? 0;
    }

    getCleanAddSurveyJson(): {} {
        return {
            question_id: this.question_id,
            text: this.text,
            sort_order: this.sort_order
        };
    }
}