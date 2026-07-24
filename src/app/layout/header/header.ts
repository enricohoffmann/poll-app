import { Component, input, inject } from '@angular/core';
import { HeaderVariant } from '../../shared/utils/types';
import { Button } from '../../shared/components/button/button';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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

  private breakpontObserver = inject(BreakpointObserver);

  readonly isMobile = toSignal(
    this.breakpontObserver.observe('(max-width: 900px)').pipe(
      map(result => result.matches)
    ), {initialValue: false}
  );

  onNewSurvey(): void {
    this.router.navigate(['create']);
  }

  backToHome(): void {
    this.router.navigate(['home']);
  }
}
