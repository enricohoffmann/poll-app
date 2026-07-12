import { Survey } from '../interfaces/survey-interface';
import { getIsoDateFromGerminDate } from '../shared/utils/custom-functions';

export class SurveyModel implements Survey {
    id: number;
    title: string;
    description: string | null;
    expires_at: string | null;
    category_id: number;
    is_published: boolean;
    created_at: string;

    constructor(surveyData: Partial<Survey> = {}) {
        this.id = surveyData.id ?? 0;
        this.title = surveyData.title ?? '';
        this.description = surveyData.description ?? null;
        this.expires_at = surveyData.expires_at ?? null;
        this.category_id = surveyData.category_id ?? 0;
        this.is_published = surveyData.is_published ?? false;
        this.created_at = surveyData.created_at ?? '';

        if(this.expires_at) {
            this.expires_at = getIsoDateFromGerminDate(this.expires_at);
        }

    }

    getCleanAddSurveyJson(): {} {
        return {
            title: this.title,
            description: this.description,
            expires_at: this.expires_at,
            category_id: this.category_id,
            is_published: this.is_published
        };
    }

}