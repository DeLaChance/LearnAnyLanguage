import config from '../config/config.json';
import WebSocket from 'isomorphic-ws';
import io from 'socket.io-client';

class BackendWebSocketClient {

    private websocket: WebSocket;
    private subscribers: ((data: any) => void)[];
    private notificationSubscribers: ((notification: any) => void)[];

    constructor() {
        this.initialize();
        this.subscribers = [];
        this.notificationSubscribers = [];
    }

    public subscribeToEvents(dataCallback: ((data: any) => void)) {
        this.subscribers.push(dataCallback);
    }

    public subscribeToNotifications(dataCallback: ((notification: any) => void)) {
        this.notificationSubscribers.push(dataCallback);
    }

    private initialize() {
        let url: string = config.websocketUrl;

        console.log(`Connecting to websocket at ${url}.`);
        var socket = io(url);
        socket.on('connect', this.onOpen);
        socket.on('disconnect', this.onClose);

        socket.on('heartbeats', (data: any) => this.logHeartBeat());
        socket.on('events', (event: any) => this.handleEvent(event));
        socket.on('notifications', (notification: any) => this.handleNotifications(notification));
    }

    private onOpen() {
        console.log("Websocket connected.");
    }

    private onClose() {
        console.log("Websocket disconnected");
    }

    private handleEvent(event: any) {
        console.log(`Websocket received event: ${JSON.stringify(event)}.`);
        this.subscribers.forEach(subscriber => subscriber(event));
    }

    private logHeartBeat() {
        console.log("Heartbeat received by backend websocket.");
    }

    private handleNotifications(notification: any) {
        console.log(`Notification received: ${JSON.stringify(notification)}.`);
        this.notificationSubscribers.forEach(subscriber => subscriber(notification));
    }

}

let websocketClient = new BackendWebSocketClient();
export default websocketClient;