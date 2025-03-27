"use client";
import { initDraw } from "@/draw/Draw";
import { useRef, useEffect } from "react";

export function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (canvasRef.current) {
        initDraw(canvasRef.current);
      }
    }, []);

    return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ backgroundColor: 'white' }}></canvas>
}

export default Canvas;