import { NgClass } from '@angular/common';
import { Component, input, computed } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-check-field',
  imports: [NgClass],
  templateUrl: './check-field.html',
  styleUrl: './check-field.scss',
})
export class CheckField {

  checkInputControl = input.required<FormControl<boolean>>();

  private readonly CHECK_BORDER_VARIANT: Record<'dark' | 'bright', string> = {
    dark: 'check-btn-dark',
    bright: 'check-btn-bright'
  };

  borderVariant = input<'dark' | 'bright'>('bright');

  checkButtonVariant = computed(() => this.CHECK_BORDER_VARIANT[this.borderVariant()]);

  onCheckButtonClick(): void {
    const currentValue = this.checkInputControl().value;
    this.checkInputControl().setValue(!currentValue);
  }

}
