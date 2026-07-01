import type { BookingStatus } from "./types";

export const isBookingAllowed = (targetDate: Date): BookingStatus => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  if (target < today) return { allowed: false, reason: "過去の日付です" };
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const targetYear = target.getFullYear();
  const targetMonth = target.getMonth();
  let nextMonthYear = currentYear;
  let nextMonth = currentMonth + 1;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextMonthYear++;
  }
  if (targetYear === currentYear && targetMonth === currentMonth)
    return { allowed: true };
  if (targetYear === nextMonthYear && targetMonth === nextMonth) {
    if (today.getDate() >= 25) return { allowed: true };
    else return { allowed: false, reason: "翌月の予約は25日から可能です" };
  }
  return { allowed: false, reason: "予約期間外です" };
};
