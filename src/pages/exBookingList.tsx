import React, { useState, useEffect } from "react";
import { getBookings } from "../utils/api";

interface Booking {
  user_id: string;
  room_id: string;
  date: string;
  start_datetime: string;
  end_datetime: string;
  roomName: string;
  // その他の予約に関連するプロパティ
}

const exBookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBookings()
      .then((data) => {
        console.log("Bookings data:", data);
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Booking List</h1>
      <ul>
        {bookings.map((booking, index) => (
          <li key={index}>
            User ID: {booking.user_id}, Room ID: {booking.room_id}, Start:{" "}
            {booking.start_datetime}, End: {booking.end_datetime}
            {booking.roomName} - {booking.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default exBookingList;
