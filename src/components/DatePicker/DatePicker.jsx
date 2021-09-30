import React, { useEffect, useRef, useState } from "react";
import "./DatePicker.css";
import { useOnClickOutside } from "../../helpers/hooks/outsideClick";
import { convertMonth, months } from "../../helpers/convertMonth";
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

  const [currentDate, setCurrentDate] = useState(selectedDay);
  const [currentMonth, setCurrentMonth] = useState(selectedDay.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDay.getFullYear());
  const [inputValue, setInputValue] = useState(
    selectedDay.toLocaleDateString()
  );

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isCalendarOpen]);

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInCurrentMonth = daysInMonth(
    currentMonth + 1,
    currentDate.getFullYear()
  );

  const selectDate = (date, year = currentYear, month) => {
    const newDate = new Date();
    newDate.setDate(date);
    newDate.setMonth(month ? month : currentMonth);
    newDate.setFullYear(year);
    setCurrentYear(year);
    setCurrentDate(() => newDate);
    if (month) {
      setCurrentMonth(month);
    }
    setInputValue(newDate.toLocaleDateString());
    if (dateRange === "year" || dateRange === "currentYear") {
      setDateRange("month");
    } else {
      setOpenCalendar(false);
    }
  };

  const next = () => {
    if (dateRange === "month") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    if (dateRange === "currentYear") {
      setCurrentYear(currentYear + 1);
    }
  };

  const prev = () => {
    if (dateRange === "month") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
    if (dateRange === "currentYear") {
      setCurrentYear(currentYear - 1);
    }
  };

  const dayClassNames = (day, className, month) => {
    const current =
      currentDate.getMonth() === currentMonth &&
      day === currentDate.getDate() &&
      currentDate.getFullYear() === currentYear;
    const todayDate = new Date();
    const today =
      todayDate.getMonth() === currentMonth &&
      day === todayDate.getDate() &&
      todayDate.getFullYear() === currentYear;
    const todayYear =
      day === currentDate.getDate() &&
      month &&
      currentDate.getFullYear() === currentYear &&
      month === currentDate.getMonth();
    return `${className} ${
      current && dateRange !== "currentYear" && "currentDay"
    } ${
      today && className === "day" && dateRange !== "currentYear" && "today"
    } ${todayYear && dateRange === "currentYear" && "currentDay"}`;
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
        return (
          <div
            key={day}
            className={dayClassNames(day + 1, "day")}
            onClick={() => selectDate(day + 1)}
          >
            {day + 1}
          </div>
        );
      })}
    </div>
  );

  const yearMode = (
    <div className="calendarYear">
      {years().map((year) => {
        return (
          <div
            key={year}
            className={`year ${
              new Date().getFullYear() === year + 1 && "today"
            } ${currentDate.getFullYear() === year && "currentYear"}`}
            onClick={() => {
              selectDate(currentDate.getDate(), year + 1);
              setDateRange("month");
            }}
          >
            {year + 1}
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
            <b>{`${day} `}</b>
            <span>{countCurrentWeek()[index]}</span>
          </div>
        );
      })}
    </div>
  );

  const currentYearMode = (
    <div className="calendarCurrentYear">
      {months.map((month, index) => {
        const daysPerMonth = daysInMonth(index + 1, currentYear);
        return (
          <div>
            <h6 className="monthHeader">{month}</h6>
            <div className="calendar">
              {weekDay.map((day) => {
                return (
                  <div key={day} className="yearWeekDay">
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="yearWeek">
              {[
                ...Array(new Date(currentYear, index, 1).getDay() + 1).keys(),
              ].map((day) => {
                if (!day) {
                  return;
                }
                return <div key={day} />;
              })}
              {[...Array(daysPerMonth).keys()].map((day) => {
                return (
                  <div
                    key={day}
                    className={dayClassNames(day + 1, "yearDay", index)}
                    onClick={() => selectDate(day + 1, currentYear, index)}
                  >
                    {day + 1}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="wrapper" ref={calendarRef}>
      <input
        onClick={() => setOpenCalendar(true)}
        placeholder="dd/mm/yyyy"
        onChange={(e) => {
          setInputValue("");
          setOpenCalendar(false);
          setInputValue(e.target.value);
        }}
        onBlur={(e) => {
          const dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/;
          if (!e.target.value.match(dateReg)) {
            setInputValue(currentDate.toLocaleDateString());
          } else {
            const date = new Date();
            const eventTarget = e.target.value;
            const value = {
              day: eventTarget.slice(0, 2),
              month: eventTarget.slice(3, 5) - 1,
              year: eventTarget.slice(6, 10),
            };
            date.setDate(+value.day);
            date.setMonth(value.month);
            date.setFullYear(+value.year);
            setInputValue(eventTarget);
            setCurrentDate(date);
            setCurrentMonth(value.month);
            setCurrentYear(+value.year);
          }
        }}
        value={inputValue}
      />
      {isCalendarOpen && (
        <div className="calendarContainer">
          <header className="calendarHeader">
            <i className="fas fa-chevron-left" onClick={() => prev()} />
            <span onClick={() => setDateRange("year")}>{`${
              dateRange !== "currentYear" ? convertMonth(currentMonth) : ""
            } ${currentYear}`}</span>
            <i className="fas fa-chevron-right" onClick={() => next()} />
          </header>
          {dateRange === "month" && monthMode}
          {dateRange === "year" && yearMode}
          {dateRange === "week" && weekMode}
          {dateRange === "currentYear" && currentYearMode}
          <div className="timeLive">{time.toLocaleTimeString()}</div>
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
              disabled={dateRange === "currentYear"}
              onClick={() => setDateRange("currentYear")}
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
