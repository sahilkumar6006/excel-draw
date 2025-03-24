"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = React.useState("");
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col gap-4">
        <input type="text" placeholder="Room Id" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="border border-gray-300 rounded px-4 py-2" />
        <button onClick={() => router.push(`/room/${roomId}`)}>Enter</button>
      </div>
    </div>
  );
}
