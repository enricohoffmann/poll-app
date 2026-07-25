import { Category } from "./category-interface";
import { Survey } from "./survey-interface";

/**
 * @description Represents a survey along with its category and the difference in days until it expires.
 */
export interface SurveyWithCategory extends Survey {
    category: Category;
    difference_in_days: number;
}