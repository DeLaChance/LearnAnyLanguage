import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import config from '../../config/config.json';

@WebSocketGateway(config.websocket.port, { namespace: 'events' })
export class WebSocketAdapter implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;

    handleDisconnect(client: Socket) {
        Logger.log(`Client disconnected: ${client.id}`);
    }
    
    handleConnection(client: Socket, ...args: any[]) {
        Logger.log(`Client connected: ${client.id}`);
    }

    afterInit(server: any) {
        Logger.log(`Set up websocket at port ${config.websocket.port}`)
    }

    sendEvent(event: any) {
        this.server.emit('events', event);
    }

}