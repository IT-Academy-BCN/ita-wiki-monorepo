export const computeEndDate = (
  startDate: string,
  time: number,
  unitTime: string,
): string => {
  if (!startDate || !time || !unitTime) return "";
  const [year, month, day] = startDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (unitTime === "week") date.setDate(date.getDate() + time * 7);
  if (unitTime === "month") date.setMonth(date.getMonth() + time);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
