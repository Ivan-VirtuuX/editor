export const numberValidator = (e: KeyboardEvent) =>
  (e.key < "48" || e.key > "57") && e.key !== "46" && e.preventDefault();
