/**
 * @description This file contains validation messages for form controls in the application. Each message corresponds to a specific validation error and provides user-friendly feedback.
 */

export const VALIDATION_MESSAGES = {
    required: () => 'This field is required.',
    minlength: (e: any) => `Minimum ${e.requiredLength} characters required.`,
    maxlength: (e: any) => `Maximum ${e.requiredLength} characters allowed.`,
    datePatternInvalid: () => 'The date must be in the format DD.MM.YYYY.',
    dateInvalid: () => 'The date must be valid',
    dateExpired: () => 'The date must be in the future.',
    categoryNotSelected: () => 'Please select a category.',
    whitespace: () => 'This field must not contain only spaces.',
    maxWordLength: (error: { maxLength: number }) => `Words may not contain more than ${error.maxLength} characters.`
  };