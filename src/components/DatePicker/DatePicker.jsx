import React, { useRef, useState } from "react";
import "./DatePicker.css";
import { useOnClickOutside } from "../../helpers/hooks/outsideClick";
import { convertMonth } from "../../helpers/convertMonth";
import { weekDay } from "../../helpers/daysInWeek";
import { years } from "../../helpers/availableYears";

const DatePicker = ({ selectedDay = new Date() }) => {
  const [isCalendarOpen, setOpenCalendar] = useState(false);
  const calendarRef = useRef(null);

  useOnClickOutside(calendarRef, () => {
    setOpenCalendar(false);
    setDateRange("month");
  });

  const [dateRange, setDateRange] = useState("month");

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(selectedDay.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDay.getFullYear());

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInCurrentMonth = daysInMonth(
    currentMonth + 1,
    currentDate.getFullYear()
  );

  const selectDate = (date, year = currentYear) => {
    const newDate = new Date();
    newDate.setDate(date);
    newDate.setMonth(currentMonth);
    newDate.setFullYear(year);
    setCurrentYear(year);
    setCurrentDate(newDate);
    if (dateRange === "year") {
      setDateRange("month");
    } else {
      setOpenCalendar(false);
    }
  };

  const nextMonth = () => {
    if (dateRange === "month") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const prevMonth = () => {
    if (dateRange === "month") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const monthMode = (
    <div className="calendar">
      {weekDay.map((day) => {
        return (
          <div key={day} className="weekDay">
            {day}
          </div>
        );
      })}
      {[
        ...Array(new Date(currentYear, currentMonth, 1).getDay() + 1).keys(),
      ].map((day) => {
        if (!day) {
          return;
        }
        return <div key={day} />;
      })}
      {[...Array(daysInCurrentMonth + 1).keys()].map((day) => {
        if (!day) {
          return;
        }
        const dayClassNames = () => {
          const current =
            currentDate.getMonth() === currentMonth &&
            day === currentDate.getDate() &&
            currentDate.getFullYear() === currentYear;
          const todayDate = new Date();
          const today =
            todayDate.getMonth() === currentMonth &&
            day === todayDate.getDate() &&
            todayDate.getFullYear() === currentYear;
          return `day ${current && "currentDay"} ${today && "today"}`;
        };
        return (
          <div
            key={day}
            className={dayClassNames()}
            onClick={() => selectDate(day)}
          >
            {day}
          </div>
        );
      })}
    </div>
  );

  const yearMode = (
    <div className="calendarYear">
      {years().map((year) => {
        if (!year) {
          return;
        }
        return (
          <div
            key={year}
            className={`year ${new Date().getFullYear() === year && "today"} ${
              currentDate.getFullYear() === year && "currentYear"
            }`}
            onClick={() => {
              selectDate(currentDate.getDate(), year);
              setDateRange("month");
            }}
          >
            {year}
          </div>
        );
      })}
    </div>
  );

  const countCurrentWeek = () => {
    const currentWeek = [];
    const curr = new Date(currentDate);
    for (let i = 0; i <= 7; i++) {
      currentWeek.push(
        new Date(curr.setDate(curr.getDate() - curr.getDay() + i)).getDate()
      );
    }
    return currentWeek;
  };

  const weekMode = (
    <div className="calendarWeek">
      {weekDay.map((day, index) => {
        return (
          <div
            key={day}
            className={`week ${
              currentDate.getDay() === index && "currentWeek"
            }`}
          >
            {day} {countCurrentWeek()[index]}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="wrapper" ref={calendarRef}>
      <input
        onClick={() => setOpenCalendar(true)}
        value={currentDate.toDateString()}
      />
      {isCalendarOpen && (
        <div className="calendarContainer">
          <header className="calendarHeader">
            <i onClick={() => prevMonth()}> {"<"} </i>
            <span onClick={() => setDateRange("year")}>{`${convertMonth(
              currentMonth
            )} ${currentYear}`}</span>
            <i onClick={() => nextMonth()}> > </i>
          </header>
          {dateRange === "month" && monthMode}
          {dateRange === "year" && yearMode}
          {dateRange === "week" && weekMode}
          <footer className="calendarFooter">
            <button
              disabled={dateRange === "month"}
              onClick={() => setDateRange("month")}
            >
              Month
            </button>
            <button
              disabled={dateRange === "week"}
              onClick={() => setDateRange("week")}
            >
              Week
            </button>
            <button
              disabled={dateRange === "year"}
              onClick={() => setDateRange("year")}
            >
              Year
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
