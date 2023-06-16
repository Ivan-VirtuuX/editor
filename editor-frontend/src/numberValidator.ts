export const numberValidator = (e: KeyboardEvent) =>
  (e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 46 && e.preventDefault();
