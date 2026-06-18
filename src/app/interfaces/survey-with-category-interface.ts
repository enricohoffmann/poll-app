import { Category } from "./category-interface";
import { Survey } from "./survey-interface";


export interface SurveyWithCategory extends Survey {
    category: Category;
    difference_in_days: number;
}