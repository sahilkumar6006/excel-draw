import { BACKENED_URL } from "@/config";

type Shapes = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
};

// Declare the global window property for TypeScript
declare global {
    interface Window {
        selectedTool: string;
    }
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");
    
    let existingShapes: Shapes[] = await getExistingShapes(roomId);
    
    if (!ctx) {
        return;
    }
    
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape.shape);
            clearCanvas(existingShapes, canvas, ctx);
        }
    };
    
    clearCanvas(existingShapes, canvas, ctx);
    let clicked = false;
    let startX = 0;
    let startY = 0;
    
    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });
    
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        
        const selectedTool = window.selectedTool;
        let shape: Shapes | null = null;
        
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width
            };
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: startX + radius,
                centerY: startY + radius,
            };
        } else if (selectedTool === "pencil") {
            shape = {
                type: "pencil",
                startX: startX,
                startY: startY,
                endX: e.clientX,
                endY: e.clientY
            };
        }
        
        if (!shape) {
            return;
        }
        
        existingShapes.push(shape);
        
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId
        }));
    });
    
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)";
            
            const selectedTool = window.selectedTool;
            if (selectedTool === "rect") {
                ctx.strokeRect(startX, startY, width, height);   
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = startX + radius;
                const centerY = startY + radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();                
            } else if (selectedTool === "pencil") {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();
                ctx.closePath();
            }
        }
    });            
}

export async function clearCanvas(existingShapes: Shapes[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    existingShapes.forEach((shape) => {
        ctx.strokeStyle = "rgba(255, 255, 255)";
        
        if (shape.type === "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();                
        } else if (shape.type === "pencil") {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
            ctx.closePath();
        }
    });
} 

export async function getExistingShapes(roomId: string): Promise<Shapes[]> {
    const response = await fetch(`${BACKENED_URL}/api/v1/room/chats/${roomId}/`);
    const messages = await response.json();
    
    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
    });
    
    return shapes;
}