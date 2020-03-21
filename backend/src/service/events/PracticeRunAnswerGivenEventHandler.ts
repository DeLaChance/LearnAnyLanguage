import { PracticeRunAnswerGivenEvent } from "../../domain/events/PracticeRunAnswerGivenEvent";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { PracticeRunService } from "../PracticeRunService";
import { Inject } from "@nestjs/common";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";

@EventsHandler(PracticeRunAnswerGivenEvent)
export class PracticeRunAnswerGivenEventHandler implements IEventHandler<PracticeRunAnswerGivenEvent> {

    @Inject()
    practiceRunService: PracticeRunService;

    @Inject()
    webSocketAdapter: WebSocketAdapter;

    handle(event: PracticeRunAnswerGivenEvent) {
        this.practiceRunService.scheduleNextAnswerTimeout(event.runId);
        this.webSocketAdapter.sendEvent(event);
    }
    
}