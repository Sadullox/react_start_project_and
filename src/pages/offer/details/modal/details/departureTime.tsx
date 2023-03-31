import { DatePicker, Form } from "antd";
import React, { useEffect, useState } from "react";
import { formatMessage } from "language/Lang";

const date: Date = new Date(),
  hour = date?.getHours(),
  minutes = date?.getMinutes();

function CurrentDate() {
  const [time, setTime] = useState<string>(
    `${hour >= 10 ? hour : `0${hour}`}:${
      minutes >= 10 ? minutes : `0${minutes}`
    }`
  );

  useEffect(() => {
    setInterval(() => {
      const date: Date = new Date(),
        hour = date?.getHours(),
        minutes = date?.getMinutes();
      setTime(
        `${hour >= 10 ? hour : `0${hour}`}:${
          minutes >= 10 ? minutes : `0${minutes}`
        }`
      );
    }, 9000);
  }, []);
  return <h2>{time}</h2>;
}

function DepartureTime() {
  return (
    <div className={"date d-flex"}>
      <Form.Item name={"create_date"} label={formatMessage("departure_time")}>
        <DatePicker
          tabIndex={-1}
          showTime={{ minuteStep: 15, secondStep: 30 }}
          format={"DD.MM.YYYY HH:mm"}
          placeholder={formatMessage({ id: "now" })}
          allowClear
          showNow
        />
      </Form.Item>
      <CurrentDate />
    </div>
  );
}

export default DepartureTime;
