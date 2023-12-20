import React, { useState, useEffect } from "react";
import RoomCard from "@/components/RoomCard";
import { getRooms } from "@/utils/api";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Router from "next/router";

interface Room {
  room_id: number;
  room_name: string;
  capacity: number;
  executive: boolean;
  photo_url: string;
}

const OfficerPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fetchedRooms = await getRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "役員" && role !== "管理者") {
      Router.push("/login");
    }
  }, []);

  const handleReserve = (roomId: number) => {
    router.push(`/reservOfficer?roomId=${roomId}`);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        {rooms.map((room) => (
          <div className="w-1/4 p-2" key={room.room_id}>
            <RoomCard room={room} onReserve={handleReserve} />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGoHome}
        >
          Homeに戻る
        </button>
      </div>
    </div>
  );
};

export default OfficerPage;
