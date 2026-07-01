import type { TimeSlot } from "./types";

// 管理者パスワード
export const ADMIN_HASH =
  "0ee90d89ff7e29bd4950bab53abba1cfd82ff2edd27151e48725b614f1b21643";

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let h = 8; h <= 22; h++) {
    const hourId = h.toString().padStart(2, "0");
    const nextHour = h + 1;
    slots.push({ id: `${hourId}:00`, label: `${h}:00-${h}:30` });
    slots.push({ id: `${hourId}:30`, label: `${h}:30-${nextHour}:00` });
  }
  return slots;
};
export const TIME_SLOTS = generateTimeSlots();

export const RESOURCES = [
  { id: "laser-plus", name: "レーザー有 MEA", color: "teal" },
  { id: "laser-minus", name: "レーザー無 MEA", color: "indigo" },
];
