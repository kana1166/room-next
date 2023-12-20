import React, { useEffect, useState } from "react";
import { fetchAPI } from "../utils/api";

interface GuestUser {
  guest_user_id: string;
  name: string;
  booking_id: string;
}

const GuestPage: React.FC = () => {
  const [guestUsers, setGuestUsers] = useState<GuestUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // fetchGuestUsers関数は非同期関数として定義されています
    const fetchGuestUsers = async () => {
      try {
        const response = await fetchAPI("/guest_users/");
        let data;
        if (response.json) {
          // response が json メソッドを持っている場合のみ実行
          data = await response.json();
        } else {
          // response が既にJSON形式のデータを持っている場合
          data = response;
        }
        setGuestUsers(data);
      } catch (err) {
        // エラーハンドリング
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    // useEffect内でfetchGuestUsers関数を呼び出します
    fetchGuestUsers();
  }, []); // 空の依存配列を指定して、コンポーネントのマウント時にのみ実行されるようにします

  // エラーがある場合、エラーメッセージを表示します
  if (error) return <p>Error: {error}</p>;

  // データが取得できた場合、ゲストユーザーのリストを表示します
  return (
    <>
      <h1 className="text-2xl font-semibold text-center">ゲストユーザー一覧</h1>
      <div className="p-6">
        {guestUsers.map((user) => (
          <div
            key={user.guest_user_id}
            className="border-b border-gray-200 py-4"
          >
            <p className="text-lg font-semibold">{user.name}</p>
            <p>予約ID: {user.booking_id}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default GuestPage;
