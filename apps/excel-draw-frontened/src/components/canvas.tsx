"use client";
import { initDraw } from "@/draw/Draw";
import { useRef, useEffect } from "react";

export function Canvas(roomId: string) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (canvasRef.current) {
        initDraw(canvasRef.current, roomId, new WebSocket(`ws://localhost:3002/api/v1/room/chats/${roomId}/`));
      }
    }, [roomId]);

    return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ backgroundColor: 'white' }}></canvas>
}

export default Canvas;