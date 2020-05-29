import config from '../config/config.json';
import WebSocket from 'isomorphic-ws';
import io from 'socket.io-client';

class BackendWebSocketClient {

    private websocket: WebSocket;
    private subscribers: ((data: any) => void)[];

    constructor() {
        this.initialize();
        this.subscribers = [];
    }

    public subscribe(dataCallback: ((data: any) => void)) {
        this.subscribers.push(dataCallback);
    }

    private initialize() {
        let url: string = config.websocketUrl;

        console.log(`Connecting to websocket at ${url}.`);
        var socket = io(url);
        socket.on('connect', this.onOpen);
        socket.on('disconnect', this.onClose);

        socket.on('heartbeats', (data: any) => this.logHeartBeat());
        socket.on('events', (event: any) => this.handleEvent(event));
    }

    private onOpen() {
        console.log("Websocket connected.");
    }

    private onClose() {
        console.log("Websocket disconnected");
    }

    private handleEvent(event: any) {

        console.log(`Websocket received event: ${event}.`);
        this.subscribers.forEach(subscriber => subscriber(event));
    }

    private logHeartBeat() {
        console.log("Heartbeat received by backend websocket.");
    }

}

let websocketClient = new BackendWebSocketClient();
export default websocketClient;