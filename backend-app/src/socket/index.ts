import {Server} from "socket.io";

import { registerSocketHandlers } from "./socket.handler";

import {
    ClienttoServerEvents,
    ServerToClientsEvents,
    SocketData
} from "./socket.types";

export const initSocket =(httpServer:any)=>{
    const io =new Server<
    ClienttoServerEvents,ServerToClientsEvents,{},SocketData >(httpServer,{
        cors:{
            origin:"*"
        }
    });
    io.on("connection",(socket)=>{
        registerSocketHandlers(socket);
    });
};