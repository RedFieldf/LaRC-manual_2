import type { Reservation } from "../types";
import { isBookingAllowed } from "../booking";
import { IconArrowLeft, IconArrowRight, IconLock } from "../icons";

export function CalendarView({
  selectedDate,
  onChangeDate,
  onSelectDate,
  reservations,
}: {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  reservations: Reservation[];
}) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++)
    days.push(new Date(year, month, d));
  const changeMonth = (diff: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + diff);
    onChangeDate(newDate);
  };
  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          <IconArrowLeft />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {year}年 {monthNames[month]}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
        >
          <IconArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center py-2 border-b text-xs font-bold text-gray-500 bg-gray-50">
        <span className="text-red-500">日</span>
        <span>月</span>
        <span>火</span>
        <span>水</span>
        <span>木</span>
        <span>金</span>
        <span className="text-blue-500">土</span>
      </div>
      <div className="grid grid-cols-7 flex-1 auto-rows-fr p-2 gap-1 bg-gray-100 overflow-y-auto">
        {days.map((date, i) => {
          if (!date) return <div key={i} className="bg-transparent"></div>;
          const dateStr = date.toISOString().split("T")[0];
          const count = reservations.filter((r) => r.date === dateStr).length;
          const isToday = new Date().toDateString() === date.toDateString();
          const { allowed } = isBookingAllowed(date);
          return (
            <button
              key={i}
              onClick={() => onSelectDate(date)}
              className={`relative flex flex-col items-center justify-start pt-2 rounded-lg transition border shadow-sm h-20 sm:h-24 ${isToday ? "bg-blue-50 border-blue-400 ring-2 ring-blue-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
            >
              <span
                className={`text-sm font-bold ${date.getDay() === 0 ? "text-red-500" : date.getDay() === 6 ? "text-blue-500" : "text-gray-700"}`}
              >
                {date.getDate()}
              </span>
              {count > 0 && (
                <span className="mt-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-full">
                  {count}件
                </span>
              )}
              {!allowed && (
                <span className="absolute bottom-1 right-1 text-gray-300">
                  <IconLock />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
