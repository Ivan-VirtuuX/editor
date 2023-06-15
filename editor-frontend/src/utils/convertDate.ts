export const convertDate = (updatedAt: Date): string => {
  return new Date(updatedAt).toLocaleDateString("ru-Ru", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
