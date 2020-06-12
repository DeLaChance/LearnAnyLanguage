import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";
import { PracticeRunAnswerCreatedEvent } from "../../domain/events/PracticeRunAnswerCreatedEvent";

@EventsHandler(PracticeRunAnswerCreatedEvent)
export class PracticeRunAnswerCreatedEventHandler implements IEventHandler<PracticeRunAnswerCreatedEvent> {

    @Inject()
    webSocketAdapter: WebSocketAdapter;

    handle(event: PracticeRunAnswerCreatedEvent) {
        this.webSocketAdapter.sendEvent(event);
    }    
}