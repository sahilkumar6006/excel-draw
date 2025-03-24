import axios from "axios";
import { BACKEND_URL } from "../config";

async function  getChats(roomId: string) {
    const response = await axios.get(`${BACKEND_URL}/api/v1/rooms/${roomId}/chats`);
    return response.data;
}


export function ChatRoom({ roomId }: { roomId: string }) {
    const chats = getChats(roomId);
    return <div>Chat Room {roomId} {chats}</div>;
}