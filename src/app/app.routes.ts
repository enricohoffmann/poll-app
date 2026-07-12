import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { SurveyCreate } from './features/survey-create/survey-create';
import { SurveyView } from './features/survey-view/survey-view';

export const routes: Routes = [
    { path: '', component: Home, pathMatch: 'full' },
    { path: 'home', component: Home},
    { path: 'create', component: SurveyCreate },
    { path: 'view/:surveyId', component: SurveyView},
    { path: '**', redirectTo: '' }
];
