import { Component, input, signal, computed } from '@angular/core';
import { ButtonVariant } from '../../utils/types';
import { NgClass } from "../../../../../node_modules/@angular/common/types/_common_module-chunk";

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {

  private readonly BUTTON_CLASSES: Record<ButtonVariant, string> = {
    primaryBtn: 'btn--primary',
    secondaryBtn: 'btn--secondary',
    tertiaryBtn: 'btn--tertiary',
    filterBtn: 'btn--filter'
  };

  buttonVariant = input<ButtonVariant>('primaryBtn');

  buttonClass = computed(() => this.BUTTON_CLASSES[this.buttonVariant()]);

  ngOnInit(){}



}
