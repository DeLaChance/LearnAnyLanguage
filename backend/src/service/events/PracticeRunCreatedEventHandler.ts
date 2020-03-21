import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { PracticeRunCreatedEvent } from "../../domain/events/PracticeRunCreatedEvent";
import { Inject } from "@nestjs/common";
import { PracticeRunService } from "../PracticeRunService";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";

@EventsHandler(PracticeRunCreatedEvent)
export class PracticeRunCreatedEventHandler implements IEventHandler<PracticeRunCreatedEvent> {
    
    @Inject()
    practiceRunService: PracticeRunService;

    @Inject()
    webSocketAdapter: WebSocketAdapter;

    handle(event: PracticeRunCreatedEvent) {
        this.practiceRunService.scheduleNextAnswerTimeout(event.runId);
        this.webSocketAdapter.sendEvent(event);
    }

}
