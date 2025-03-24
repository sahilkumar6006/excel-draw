import React, { useEffect } from "react";


export function useSocket() {
const [loading, setLoading] = React.useState(true);
const [socket, setSocket] = React.useState<WebSocket | null>(null);

useEffect(()=>{
    const ws = new WebSocket('ws://localhost:3002');
    
    ws.onopen = () => {
        setSocket(ws);
        setLoading(false);
    };
},[])

return { loading, socket };

}