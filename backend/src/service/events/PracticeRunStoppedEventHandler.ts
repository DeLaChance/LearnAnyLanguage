import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";
import { PracticeRunStoppedEvent } from "../../domain/events/PracticeRunStoppedEvent";

@EventsHandler(PracticeRunStoppedEvent)
export class PracticeRunStoppedEventHandler implements IEventHandler<PracticeRunStoppedEvent> {
    
    @Inject()
    webSocketAdapter: WebSocketAdapter;

    handle(event: PracticeRunStoppedEvent) {
        this.webSocketAdapter.sendEvent(event);
    }

}
