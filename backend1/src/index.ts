/*import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    //@ts-ignore
    gameManager.addUser(ws)
    //@ts-ignore
    ws.on("disconnect", ()=> gameManager.removeUser(ws));
});



*/

import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on("connection", (ws) => {
    gameManager.addUser(ws);

    ws.on("close", () => {
        gameManager.removeUser(ws);
    });
});
