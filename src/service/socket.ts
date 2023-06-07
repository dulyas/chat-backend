import conferenceService from '@/service/conference-service';
import {Server as IOServer, Socket} from "socket.io";
import * as HTTP from "http";
import { Http2SecureServer } from "http2";
import { Server } from "https";
import { ServerOptions } from "socket.io";
import UserDto from "@/dtos/user-dto";
import messageService from './message-service';
import { User } from '@/models/user-model';
import { Message } from '@/models/message-model';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
// import { RequestMessage, RequestModel } from "@/models";



interface Users {
    [key: string]: UserDto & {socketId: string}
}


export default class IOInstance extends IOServer {

    io: Server | null | void = null
    users: Users = {}

    constructor(server: Http2SecureServer | number | HTTP.Server | Server, options: Partial<ServerOptions>) {
        const io = super(server, options)

        this.io = io
        
        this.start()
    }   

    private start() {
        this.io && this.io.on('connection', (socket: Socket) => {



            socket.on('connect-user', (user: UserDto) => {

                // console.log(user)

                this.users[user._id] = {
                    ...user,
                    socketId: socket.id
                }
                
                // console.log(this.users)
            })

            socket.on('connect-room', (roomId: string) => {
                console.log('connectRoom')
                socket.join(roomId)
            })

            socket.on('disconnect', () => {
                for (const userId in this.users) {

                    if (this.users[userId].socketId === socket.id) delete this.users[userId]
                    // console.log(this.users)
                }
            })

            socket.on('new-message', (roomId: string, userId: string, textMessage: string) => {
                console.log('new message');
                
                this.createAndSendMessage(roomId, userId, textMessage)
            })
        })
    }

    async createAndSendMessage(roomId: string, userId: string, textMessage: string) {
        const conference = await conferenceService.getRoomDataById(roomId)
        // console.log('conference', conference)

        const message = await messageService.createMessage(roomId, userId, textMessage)

        this.sockets.to(roomId).emit('new-message', message)

        // for (const user of conference.users) {

        //     if (this.users[user._id]) {
        //         // console.log('send to', this.users[user._id].socketId)
        //         // socket.to(this.users[user._id].socketId).emit('new-message', message)
        //         this.sockets.to(this.users[user._id].socketId).emit('new-message', message)
        //     }
        // }
    }

    // updateRequest(updatedRequest: RequestModel, updatedMessage: RequestMessage) {

        
    //     this.io && this.io.to(this.users[updatedMessage.user_id]).emit('update-request', {
    //         request: updatedRequest,
    //         message: updatedMessage
    //     })
    // }

}
