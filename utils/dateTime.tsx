export const dateClassify = (dateTimeString: string): string => {
  const inputDate = new Date(dateTimeString);
  const now = new Date();

  // Remove time part for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const inputDay = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );

  if (inputDay.getTime() === today.getTime()) {
    return "Today";
  } else if (inputDay.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    return "Upcoming";
  }
};


export const isValidFutureDate = (dateStr: string): boolean => {
  // Check format dd-mm-yyyy
  const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JS months 0-11
  const year = parseInt(match[3], 10);

  const date = new Date(year, month, day);

  // Check if real date (avoid 32-01-2026, etc.)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return false;
  }

  // Check if future (strictly greater than today)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // remove time

  return date > today;
};