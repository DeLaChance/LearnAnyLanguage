import { PracticeRunAnswerTimedOutEvent } from "../../domain/events/PracticeRunAnswerTimedOutEvent";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { PracticeRunService } from "../PracticeRunService";
import { Inject } from "@nestjs/common";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";

@EventsHandler(PracticeRunAnswerTimedOutEvent)
export class PracticeRunAnswerTimedOutEventHandler implements IEventHandler<PracticeRunAnswerTimedOutEvent> {

    @Inject()
    practiceRunService: PracticeRunService;

    @Inject()
    webSocketAdapter: WebSocketAdapter;

    handle(event: PracticeRunAnswerTimedOutEvent) {
        this.practiceRunService.scheduleNextAnswerTimeout(event.runId);
        this.webSocketAdapter.sendEvent(event);
    }
    
}