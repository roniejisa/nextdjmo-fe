"use client";
import { useEffect, useRef, useState } from "react";

const DateComponent = ({ field, defaultValue, oldData }) => {
  // Khởi tạo state cho ngày, tháng, năm
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Tháng bắt đầu từ 0
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const inputRef = useRef(null);
  // Tạo mảng các ngày, tháng, năm
  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 120 },
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    if (oldData && oldData?.[field.name]) {
      const date = new Date(oldData?.[field.name] ?? "");
      setSelectedDay(date.getDate());
      setSelectedMonth(date.getMonth() + 1);
      setSelectedYear(date.getFullYear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldData]);

  useEffect(() => {
    inputRef.current.value = `${selectedYear}-${selectedMonth}-${selectedDay}`;
  }, [selectedDay, selectedMonth, selectedYear]);
  useEffect(() => {
    if (defaultValue) {
      const date = new Date(defaultValue);
      setSelectedDay(date.getDate());
      setSelectedMonth(date.getMonth() + 1);
      setSelectedYear(date.getFullYear());
    }
    inputRef.current.value = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <input
        type="text"
        hidden
        name={field.name}
        ref={inputRef}
        defaultValue=""
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="border p-2 focus:outline-none focus:ring-2 text-color dark:bg-dark"
          >
            <option value="">-- Ngày --</option>
            {Array.from(
              { length: daysInMonth(selectedMonth, selectedYear) },
              (_, i) => i + 1
            ).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border p-2  focus:outline-none focus:ring-2 text-color dark:bg-dark"
          >
            <option value="">-- Tháng --</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border p-2  focus:outline-none focus:ring-2 text-color dark:bg-dark"
          >
            <option value="">-- Năm --</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default DateComponent;
