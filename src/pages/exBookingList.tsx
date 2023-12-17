import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "react-modal";
import { getBookings } from "../utils/api";

// モーダルのスタイル設定（必要に応じて調整してください）
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    opacity: 1,
  },
};

interface ScheduleSlot {
  hour: string;
  isBooked: boolean;
}

interface Booking {
  user_id: string;
  room_id: string;
  start_datetime: string;
  end_datetime: string;
  roomName: string;
}

const ExBookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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

  const getUniqueBookingsPerDay = (bookings: Booking[]) => {
    const uniqueBookings: Booking[] = [];
    const seenBookings = new Map<string, Set<string>>();

    bookings.forEach((booking) => {
      const date = new Date(booking.start_datetime).toDateString();
      if (!seenBookings.has(date)) {
        seenBookings.set(date, new Set());
      }
      if (!seenBookings.get(date)!.has(booking.room_id)) {
        seenBookings.get(date)!.add(booking.room_id);
        uniqueBookings.push(booking);
      }
    });

    return uniqueBookings;
  };

  const calendarEvents = getUniqueBookingsPerDay(bookings).map((booking) => ({
    title: `Room ${booking.room_id}`,
    start: booking.start_datetime,
    end: booking.end_datetime,
    extendedProps: {
      roomName: booking.roomName,
      userId: booking.user_id,
    },
  }));

  const handleEventClick = (clickInfo: any) => {
    setSelectedDay(clickInfo.event.startStr);
    setModalIsOpen(false);
    setTimeout(() => {
      setModalIsOpen(true);
    }, 0);

    console.log("Event clicked: ", clickInfo.event.startStr);
  };

  useEffect(() => {
    if (selectedDay) {
      console.log("Selected day changed: ", selectedDay); // 選択された日付が変更されたときのログ
    }
  }, [selectedDay]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const generateDailySchedule = (selectedDay: string) => {
    // 選択された日付に対する予約をフィルタリング
    const filteredBookings = bookings.filter((booking) => {
      const startDate = new Date(booking.start_datetime).toLocaleDateString();
      const selectedDate = new Date(selectedDay).toLocaleDateString();
      return startDate === selectedDate;
    });

    const hours = Array.from({ length: 24 }, (_, i) => i + 0);

    // 各時間帯に対する予約状況を生成
    return hours.map((hour) => {
      const isBooked = filteredBookings.some((booking) => {
        const startHour = new Date(booking.start_datetime).getHours();
        return startHour === hour;
      });
      return {
        hour: `${hour}:00`,
        isBooked,
      };
    });
  };

  // スケジュールデータを元にスケジュール表をレンダリングする関数
  const renderSchedule = (dailySchedule: ScheduleSlot[]) => {
    return dailySchedule.map((slot, index) => (
      <tr key={index}>
        <td>{slot.hour}</td>
        <td>{slot.isBooked ? "×" : "○"}</td>
      </tr>
    ));
  };

  const closeModal = () => {
    setModalIsOpen(false);
    console.log("Modal closed"); // デバッグメッセージを追加
  };

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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} // モーダル外クリックやESCキーで閉じる
        style={customStyles}
      >
        <h2>予約状況</h2>
        <button onClick={closeModal}>閉じる</button>
        {selectedDay && (
          <>
            <table>
              <tbody>
                {renderSchedule(generateDailySchedule(selectedDay))}
              </tbody>
            </table>
          </>
        )}
      </Modal>
      <h2>Bookings</h2>
      <ul>
        {bookings.map((booking, index) => (
          <li key={index}>
            User ID: {booking.user_id}, Room: {booking.roomName}, Start:{" "}
            {new Date(booking.start_datetime).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            , End:{" "}
            {new Date(booking.end_datetime).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExBookingList;
