export const dateClassify = (dateString: string): string => {
  const [day, month, year] = dateString.split("-").map(Number);

  const inputDate = new Date(year, month - 1, day); // month is 0-indexed
  const now = new Date();

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

export const calculateAge = (dob: string): number => {
  if (!dob) return 0;

  const [day, month, year] = dob.split("-").map(Number);

  const birthDate = new Date(year, month - 1, day); // month is 0-based
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // If birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};


export const isCurrentWeek = (dateString: string) => {
  const today = new Date();
  const appointmentDate = new Date(dateString);

  // Get start of week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Get end of week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
};