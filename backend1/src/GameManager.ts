/*import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./Messages";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor(){
        this.games = [];
        this.pendingUser=null;
        this.users= []
    }
    addUser(socket : WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket:WebSocket){
        this.users=this.users.filter(user => user !=socket)
        // game to be stopped cuz the user left
    }
    private addHandler(socket: WebSocket){
        //@ts-ignore
        socket.on("message",(data) => {
            const message = JSON.parse(data.toString());
            if(message.type == INIT_GAME){
                if (this.pendingUser){
                    // start game
                    //@ts-ignore
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser=null;
                }
                else{
                    this.pendingUser = socket;
                }
            }
            if(message.type== MOVE){
                //@ts-ignore
                  const game = this.games.find(game => game.player1== socket || game.player2==socket);
                  if (game){
                    //@ts-ignore
                    game.makeMove(socket,message.move);
                  }
            }
        })
    }
}
    */

import { Game } from "./Game";
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages";
import WebSocket from "ws";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter((user) => user !== socket);

        // Remove any games involving this user
        this.games = this.games.filter((game) => {
            if (game.player1 === socket || game.player2 === socket) {
                const otherPlayer = game.player1 === socket ? game.player2 : game.player1;
                otherPlayer.send(
                    JSON.stringify({
                        type: GAME_OVER,
                        payload: { winner: "opponent disconnected" },
                    })
                );
                return false; // Remove the game
            }
            return true;
        });
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    // Start a new game
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(
                    (game) => game.player1 === socket || game.player2 === socket
                );
                if (game) {
                    game.makeMove(socket, message.payload);
                }
            }
        });
    }
}
