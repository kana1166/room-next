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
    const fetchGuestUsers = async () => {
      try {
        const response = await fetchAPI("/guest_users/");
        let data;
        if (response.json) {
          data = await response.json();
        } else {
          data = response;
        }
        setGuestUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchGuestUsers();
  }, []);

  if (error) return <p>Error: {error}</p>;

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
