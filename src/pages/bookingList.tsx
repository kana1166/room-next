import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getBookings } from "../utils/api";

interface Booking {
  user_id: string;
  room_id: string;
  start_datetime: string;
  end_datetime: string;
  roomName: string;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBookings()
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const calendarEvents = bookings.map((booking) => ({
    title: `(Room ${booking.room_id})`,
    start: booking.start_datetime,
    end: booking.end_datetime,
    extendedProps: {
      //追加のプロパティ
      roomName: booking.roomName,
      userId: booking.user_id,
    },
  }));

  const handleEventClick = (clickInfo: any) => {
    const clickedDate = clickInfo.event.startStr;
    const dailyBookings = bookings.filter((booking) =>
      booking.start_datetime.startsWith(clickedDate)
    );

    let message = `Bookings for ${clickedDate}:\n`;
    dailyBookings.forEach((booking) => {
      message += `Room: ${booking.roomName}, Start: ${booking.start_datetime}, End: ${booking.end_datetime}\n`;
    });

    alert(message);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Booking List and Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="ja"
        events={calendarEvents}
        eventClick={handleEventClick}
      />
      <h2>Bookings</h2>
      <ul>
        {bookings.map((booking, index) => (
          <li key={index}>
            User ID: {booking.user_id}, Room: {booking.roomName}, Start:{" "}
            {booking.start_datetime}, End: {booking.end_datetime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
