import { WebSocketServer,WebSocket } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backened-common/config";
const wss = new WebSocketServer({port: 8084})
import { prismaClient } from "@repo/db/client";

interface User {
    userId: string;
    ws: WebSocket;
    rooms: string[];
  }

interface Room {
    id: string;
    users: string[];
}

const users: User[] = [];
const rooms: Room[] = [];

function checkUser (token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded) {
            return null;
        }
        // Check for id field instead of userId
        const userId = (decoded as JwtPayload).id;
        if (!userId) {
            console.error("JWT missing id field:", decoded);
            return null;
        }
        return userId;
    } catch (error) {
        console.error("JWT verification error:", error);
        return null;
    }
}

wss.on('connection', function connection(ws, request){

    const url = request.url;
    if(!url) return;

    const querryParams = new URLSearchParams(url.split('?')[1]);
    const token = querryParams.get('token');

    if(!token) return;

    const userId = checkUser(token);
    if(!userId) {
        ws.close();
        return;
    } 

    users.push({
        userId,
        ws,
        rooms: []
    })

    ws.on('message', async function message(data){
        let parsedData;
        if(typeof data !== 'string'){
            parsedData = JSON.parse(data.toString());
        }else{
            parsedData = JSON.parse(data);
        }

       
    if (parsedData.type === "join_room") {
        const user = users.find(x => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
      }

      if (parsedData.type === "leave_room") {
        const user = users.find(x => x.ws === ws);
        if (!user) {
          return;
        }
        user.rooms = user?.rooms.filter(x => x !== parsedData.roomId);
      }

    console.log("message received")
    console.log(parsedData);

    if (parsedData.type === "chat") {
        console.log(parsedData);
        const roomId = parsedData.roomId; // Keep as string
        const message = parsedData.message;
    
        await prismaClient.chat.create({
            data: {
                roomId: roomId, // No conversion needed
                message,
                userId
            }
        });

        
       users.forEach(user => {
         if (user.rooms.includes(roomId)) {
           user.ws.send(JSON.stringify({
             type: "chat",
             message,
             userId,
             roomId
           }));
         }
       });
    }
    })

    
})