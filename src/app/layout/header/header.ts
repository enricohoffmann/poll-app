import { Component, input, inject, output } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

/**
 * Header component for the application.
 * This component displays the header section of the application, including navigation buttons and responsive behavior.
 *
 * @component
 * @selector app-header
 * @templateUrl ./header.html
 * @styleUrls ./header.scss
 * @property {boolean} isPurple - Indicates whether the header should have a purple background.
 * @property {boolean} isButtonAvailable - Indicates whether the button in the header is available for interaction.
 * @property {boolean} isMobile - A signal that indicates whether the application is being viewed on a mobile device (screen width <= 900px).
 */
@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  isPurple = input(false);
  isButtonAvailable = input(false);
  requestOpenSurvey = output<void>();
  private readonly router = inject(Router);

  private breakpointObserver = inject(BreakpointObserver);

  /**
   * A signal that indicates whether the application is being viewed on a mobile device (screen width <= 900px).
   * This signal is derived from the BreakpointObserver and updates automatically when the screen size changes.
   *
   * @readonly
   * @type {Signal<boolean>}
   */
  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 900px)').pipe(
      map(result => result.matches)
    ), {initialValue: false}
  );

  /**
   * @description Emits an event to request the opening of a new survey.
   * This method is called when the user interacts with the "New Survey" button in the header.
   * It triggers the `requestOpenSurvey` output event, which can be handled by a parent component to open a new survey.
   * @returns {void}
   */
  onNewSurvey(): void {
    this.requestOpenSurvey.emit();
  }

  /**
   * Navigates to the 'home' route when the "Back to Home" button is clicked.
   * This method is called when the user interacts with the button in the header.
   * It uses the Angular Router to navigate to the specified route.
   *
   * @method
   * @returns {void}
   */
  backToHome(): void {
    this.router.navigate(['home']);
  }
}
