import { Component, inject, signal, output } from '@angular/core';
import { SurveyService } from '../../../services/survey-service';
import { Category } from '../../../interfaces/category-interface';

@Component({
  selector: 'app-drop-down-menu',
  imports: [],
  templateUrl: './drop-down-menu.html',
  styleUrl: './drop-down-menu.scss',
})
export class DropDownMenu {
  surveyService = inject(SurveyService);
  isMenuOpen = signal(false);
  sendCategorySelection = output<Category>();
  isCategorySelected = signal(false);

  ngOnInit(): void {
    this.surveyService.getCategories();
  }

  onButtonClick(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  onCategoryClick(categoryIndex: number): void {
    this.isMenuOpen.set(false);
    const currentCategory = this.surveyService.getCategoryByIndex(categoryIndex);
    if(currentCategory){
      this.sendCategorySelection.emit(currentCategory);
      this.isCategorySelected.set(true);
    }
  }
}
