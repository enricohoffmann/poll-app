export const VALIDATION_MESSAGES = {
    required: () => 'This field is required.',
    minlength: (e: any) => `Minimum ${e.requiredLength} characters required.`,
    maxlength: (e: any) => `Maximum ${e.requiredLength} characters allowed.`,
    datePatternInvalid: () => 'The date must be in the format DD.MM.YYYY.',
    dateInvalid: () => 'The date must be valid',
    dateExpired: () => 'The date must be in the future.',
    categoryNotSelected: () => 'Please select a category.'
  };