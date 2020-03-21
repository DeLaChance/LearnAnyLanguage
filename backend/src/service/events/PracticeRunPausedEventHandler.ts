import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";
import { PracticeRunPausedEvent } from "../../domain/events/PracticeRunPausedEvent";

@EventsHandler(PracticeRunPausedEvent)
export class PracticeRunPausedEventHandler implements IEventHandler<PracticeRunPausedEvent> {
    
    @Inject()
    webSocketAdapter: WebSocketAdapter;    

    handle(event: PracticeRunPausedEvent) {
        this.webSocketAdapter.sendEvent(event);
    }

}