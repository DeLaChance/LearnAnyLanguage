import config from '../config/config.json';
import WebSocket from 'isomorphic-ws';
import io from 'socket.io-client';

class BackendWebSocketClient {

    private websocket: WebSocket;
    private subscribers: Map<string, ((data: any) => void)>;
    private notificationSubscribers: Map<string, ((data: any) => void)>;

    constructor() {
        this.initialize();
        this.subscribers = new Map();
        this.notificationSubscribers = new Map();;
    }

    public subscribeToEvents(name: string, dataCallback: ((data: any) => void)) {
        this.subscribers.set(name, dataCallback);
    }

    public subscribeToNotifications(name: string, dataCallback: ((notification: any) => void)) {
        this.notificationSubscribers.set(name, dataCallback);
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
        Array.from(this.subscribers.keys()).forEach((name: string) =>  {
            const callback: ((data: any) => void) | undefined = this.subscribers.get(name);
            if (callback) {
                callback(event);
            }
        });
    }

    private logHeartBeat() {
        console.log("Heartbeat received by backend websocket.");
    }

    private handleNotifications(notification: any) {
        Array.from(this.notificationSubscribers.keys()).forEach((name: string) =>  {
            const callback: ((data: any) => void) | undefined = this.notificationSubscribers.get(name);
            if (callback) {
                callback(notification);
            }
        });
    }

}

let websocketClient = new BackendWebSocketClient();
export default websocketClient;