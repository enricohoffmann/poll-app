import { Component, ElementRef, signal, ViewChild, input } from '@angular/core';
import { Button } from "../button/button";
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-field',
  imports: [Button, ReactiveFormsModule],
  templateUrl: './date-field.html',
  styleUrl: './date-field.scss',
})
export class DateField {

  isPickerOpen = signal(false);

  @ViewChild('dateSelectField') dateSelect!: ElementRef<HTMLInputElement>;
  dateInputControl = input.required<FormControl<string>>();

  onCalenderButtonClick(): void{
    this.dateSelect.nativeElement.showPicker();
  }

  onDatePickerChange():void {
    this.dateInputControl().setValue(this.dateSelect.nativeElement.value);
    this.isPickerOpen.set(false);
  }

}
