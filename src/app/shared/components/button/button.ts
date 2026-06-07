import { Component, input, signal, computed } from '@angular/core';
import { ButtonVariant } from '../../utils/types';
import { CommonModule, NgClass } from '@angular/common';

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

  private readonly BUTTON_ICON_CLASSES: Record<'add'|'check', string> = {
    add: 'btn-icon--add',
    check: 'btn-icon--check'
  }

  buttonVariant = input<ButtonVariant>('primaryBtn');
  buttonClass = computed(() => this.BUTTON_CLASSES[this.buttonVariant()]);
  hasIcon = input(false);
  buttonIconVariant = input<'add' | 'check'>('add');
  buttonIconClass = computed(() => this.BUTTON_ICON_CLASSES[this.buttonIconVariant()]);

  ngOnInit(){}



}
