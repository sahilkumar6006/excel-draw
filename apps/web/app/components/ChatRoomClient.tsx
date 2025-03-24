"use client";
import React, { useEffect } from 'react'
import { useSocket } from '../hooks/useSocket';

function ChatRoomClient({messages}:{
    messages: {messages: string[]}
}) {
    const [chat, setChat] = React.useState({messages: messages.messages});
    const { loading, socket } = useSocket();

    useEffect(() => {
        if (socket && !loading) {
           socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if(message.type === 'chat') {
                setChat(c => ({messages: [...c.messages, message]}))
            }
           }
        }
    }, [socket, loading]);
    return (
        <div>
            <h1>ChatRoomClient</h1>
            <ul>
                {chat.messages.map((message: any) => (
                    <li key={message.id}>{message.text}</li>
                ))}
            </ul>
        </div>
    )
}

export default ChatRoomClient