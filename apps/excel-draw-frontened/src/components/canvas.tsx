"use client";
import { WS_URL } from "@/config";
import { initDraw } from "@/draw/Draw";
import { useRef, useEffect, useState } from "react";

export function Canvas(roomId: string) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(()  => {
      const ws = new WebSocket(`${WS_URL}/${roomId}`)
      ws.onopen = () => {
        setSocket(ws)
      }
      ws.onclose = () => {
        setSocket(null)
      }
      return () => {
        ws.close();
      }
    }, [roomId])

    useEffect(() => {
      if (canvasRef.current) {
        initDraw(canvasRef.current, roomId, socket!);
      }
    }, [roomId, socket]);

    if(!socket) return <div>Loading...</div>

    return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ backgroundColor: 'white' }}></canvas>
}

export default Canvas;