import React, { useState } from "react";
import { useRouter } from "next/router";
import { createBooking } from "@/utils/api";

const ReservationPage: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [participants, setParticipants] = useState(0);
  const router = useRouter();
  const { roomId } = router.query;
  const [guestName, setGuestName] = useState(""); // ゲストユーザーの名前
  const [guestEmail, setGuestEmail] = useState(""); // ゲストユーザーのメールアドレス

  const generateTemporaryUserId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // roomIdがない場合はエラーを投げる
    if (!roomId) {
      console.error("Room ID is not specified.");
      // 必要に応じてユーザーにエラーメッセージを表示する
      return;
    }

    const tempUserId = generateTemporaryUserId();

    const reservationData = {
      user_id: tempUserId,
      room_id: Array.isArray(roomId) ? roomId[0] : roomId,
      start_datetime: startDate,
      end_datetime: endDate,
      booked_num: participants,
      guest_user: {
        name: guestName,
        email: guestEmail,
      },
    };

    console.log("Sending reservation data:", reservationData);

    try {
      // 予約データを送信
      const result = await createBooking(reservationData);
      console.log("Booking successful:", result);
      // 送信後の処理（例: 予約完了ページへのリダイレクト）
    } catch (error) {
      console.error("Booking failed:", error);
      // エラーハンドリング（例: ユーザーへのエラーメッセージ表示）
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-gray-900 text-center my-4">会議室予約</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="guestName">ゲスト名:</label>
            <input
              type="text"
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="guestEmail">ゲストのメール:</label>
            <input
              type="email"
              id="guestEmail"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="startDate">開始日時:</label>
            <input
              type="datetime-local"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate">終了日時:</label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="participants">参加人数:</label>
            <input
              type="number"
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(parseInt(e.target.value))}
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              予約する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage;
