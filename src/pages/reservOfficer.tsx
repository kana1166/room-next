import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getRoomCapacity, createBooking } from "@/utils/api";

const ReservOfficerPage: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState<number | null>(null);
  const [roomCapacity, setRoomCapacity] = useState<number | null>(null);
  const [reservationDetails, setReservationDetails] = useState({
    startDateTime: "",
    endDateTime: "",
    mainUserEmployeeNumber: "",
    memberEmployeeNumbers: "",
    guestNames: "",
    // その他の必要な情報をここに追加
  });

  useEffect(() => {
    const fetchRoomDetails = async (id: number) => {
      try {
        const capacity = await getRoomCapacity(id);
        setRoomCapacity(capacity);
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };

    if (router.query.roomId) {
      const id = Number(router.query.roomId);
      setRoomId(id);
      fetchRoomDetails(id);
    }
  }, [router.query]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setReservationDetails({ ...reservationDetails, [id]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // 社員番号から user_id を取得するロジック（適切なAPIエンドポイントを使用）
      const userIdResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/employee_number/${reservationDetails.mainUserEmployeeNumber}`
      );
      if (!userIdResponse.ok) {
        throw new Error("Failed to retrieve user information.");
      }
      const userIdData = await userIdResponse.json();

      // 予約データの構築（user_id を含める）
      const bookingData = {
        user_id: userIdData.user_id, // 取得した user_id を使用
        room_id: roomId,
        start_datetime: reservationDetails.startDateTime,
        end_datetime: reservationDetails.endDateTime,
        main_user_employee_number: reservationDetails.mainUserEmployeeNumber,
        member_employee_numbers: reservationDetails.memberEmployeeNumbers
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        guest_names: reservationDetails.guestNames
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      // 予約データの送信
      const result = await createBooking(bookingData);
      console.log("予約成功:", result);
      alert("予約完了");
      router.push("/officer");
    } catch (error) {
      console.error("予約エラー:", error);
      alert(
        "エラー: 役員専用のルームのため、主要利用者の社員番号を役員のIDにしてください。"
      );
    }
  };

  return (
    <div>
      <h1>予約フォーム</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="roomId">部屋番号</label>
          <input type="text" id="roomId" value={roomId || ""} readOnly />
        </div>
        <div>
          <label>部屋のキャパシティ</label>
          <span>{roomCapacity !== null ? roomCapacity : "Loading..."}</span>
        </div>
        <div>
          <label htmlFor="startDateTime">開始日時</label>
          <input
            type="datetime-local"
            id="startDateTime"
            value={reservationDetails.startDateTime}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="endDateTime">終了日時</label>
          <input
            type="datetime-local"
            id="endDateTime"
            value={reservationDetails.endDateTime}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="mainUserEmployeeNumber">主要利用者の社員番号</label>
          <input
            type="text"
            id="mainUserEmployeeNumber"
            value={reservationDetails.mainUserEmployeeNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="memberEmployeeNumbers">
            参加する社員の社員番号 (カンマ区切り)
          </label>
          <textarea
            id="memberEmployeeNumbers"
            value={reservationDetails.memberEmployeeNumbers}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="guestNames">ゲストの名前 (カンマ区切り)</label>
          <textarea
            id="guestNames"
            value={reservationDetails.guestNames}
            onChange={handleInputChange}
          />
        </div>
        {/* その他の入力フィールド */}
        <button type="submit">予約する</button>
      </form>
    </div>
  );
};

export default ReservOfficerPage;
