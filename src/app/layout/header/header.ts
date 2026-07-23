import { Component, input, inject } from '@angular/core';
import { HeaderVariant } from '../../shared/utils/types';
import { Button } from '../../shared/components/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isPurple = input(false);
  isButtonAvailable = input(false);
  private readonly router = inject(Router)

  onNewSurvey(): void {
    this.router.navigate(['create']);
  }

  backToHome(): void {
    this.router.navigate(['home']);
  }
}
