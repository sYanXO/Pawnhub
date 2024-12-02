/*import WebSocket from "ws";
import {Chess} from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages";
export class Game {
    public player1 : WebSocket;
    public  player2 : WebSocket;
    public board: Chess 
    private startTime: Date;
    constructor(player1 : WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload:{
                color: "black"
            }
        }))
    }
    makeMove(socket: WebSocket, move: {
        from : string,
        to : string
    }){

        if(this.board.moves.length % 2 === 0 && socket!== this.player1){
            return
        }
        console.log("1");
        if(this.board.moves.length % 2 === 0 && socket!== this.player2){
            return
        }
        console.log("2");

        try{
            this.board.move(move);
        }
        catch(e){
            console.log(e);
            return
        }
        console.log("3");

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload : {
                    winner : this.board.turn() === "w" ? "black": "white"
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload : {
                    winner : this.board.turn() === "w" ? "black": "white"
                }
            }))

            return ;
        }
        console.log("4");

        if(this.board.moves.length%2===0){
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        

        else{
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        console.log("5");
    }
}
    */
import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./Messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        this.player1.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: { color: "white" },
            })
        );
        this.player2.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: { color: "black" },
            })
        );
    }

    makeMove(socket: WebSocket, move: { from: string; to: string }) {
        // Ensure it's the correct player's turn
        if (this.board.turn() === "w" && socket !== this.player1) {
            console.log("It's White's turn.");
            return;
        } else if (this.board.turn() === "b" && socket !== this.player2) {
            console.log("It's Black's turn.");
            return;
        }
    
        // Try making the move
        try {
            const result = this.board.move(move);
            if (!result) {
                console.log("Invalid move.");
                return;
            }
        } catch (error) {
            console.error("Error processing move:", error);
            return;
        }
    
        // If the game is over, send a GAME_OVER message to both players
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: { winner },
                })
            );
            this.player2.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: { winner },
                })
            );
            return;
        }
    
        // Broadcast the move to both players
        const moveData = {
            type: MOVE,
            payload: move,
        };
    
        // Send the move data to both players
        this.player1.send(JSON.stringify(moveData));
        this.player2.send(JSON.stringify(moveData));
    }
    
}    
