import { NgClass } from '@angular/common';
import { Component, input, computed } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @description A custom check field component that manages its own form control and border variant.
 */
@Component({
  selector: 'app-check-field',
  imports: [NgClass],
  templateUrl: './check-field.html',
  styleUrls: ['./check-field.scss'],
})
export class CheckField {

  checkInputControl = input.required<FormControl<boolean>>();

  /**
   * @description A mapping of border variants for the check button, allowing for dynamic styling based on the selected variant.
   */
  private readonly CHECK_BORDER_VARIANT: Record<'dark' | 'bright', string> = {
    dark: 'check-btn-dark',
    bright: 'check-btn-bright'
  };

  borderVariant = input<'dark' | 'bright'>('bright');

  /**
   * @description A computed property that returns the appropriate CSS class for the check button based on the selected border variant.
   * @returns {string} The CSS class corresponding to the current border variant.
   */
  checkButtonVariant = computed(() => this.CHECK_BORDER_VARIANT[this.borderVariant()]);

  /**
   * @description Toggles the value of the check input control when the check button is clicked. If the current value is true, it will be set to false, and vice versa.
   * @returns {void}
   */
  onCheckButtonClick(): void {
    const currentValue = this.checkInputControl().value;
    this.checkInputControl().setValue(!currentValue);
  }

}
