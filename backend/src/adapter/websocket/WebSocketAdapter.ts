import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import config from '../../config/config.json';
import { Cron, CronExpression } from '@nestjs/schedule';

@WebSocketGateway()
export class WebSocketAdapter implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    private readonly logger = new Logger(WebSocketAdapter.name);


    @WebSocketServer() 
    private server: Server;

    constructor() {
    }

    @SubscribeMessage('events')
    onSubscribe(client: Socket, message: string) {
        return message;
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    
    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    afterInit(server: any) {
        Logger.log(`Set up websocket.`)
    }

    sendEvent(event: any) {
        this.logger.log(`Sending event ${event} over socket.io`);
        this.server.emit('events', event);
    }

    sendNotification(runId: string, timeSpentOnCurrentWord: number) {
        const notification: any = {
            "runId": runId, 
            "timeSpentOnCurrentWord": timeSpentOnCurrentWord
        };
        this.logger.log(`Sending notification ${JSON.stringify(notification)} over socket.io`);
        this.server.emit('notifications', notification);
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    private sendHeartBeat() {
        this.server.emit("heartbeats", {});
    }

}