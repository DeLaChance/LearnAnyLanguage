import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PracticeRunService } from "../PracticeRunService";
import { PracticeRunRestartedEvent } from "../../domain/events/PracticeRunRestartedEvent";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";

@EventsHandler(PracticeRunRestartedEvent)
export class PracticeRunRestartedEventHandler implements IEventHandler<PracticeRunRestartedEvent> {
    
    @Inject()
    practiceRunService: PracticeRunService;

    @Inject()
    webSocketAdapter: WebSocketAdapter;        

    handle(event: PracticeRunRestartedEvent) {
        this.practiceRunService.scheduleNextAnswerTimeout(event.runId);
        this.webSocketAdapter.sendEvent(event);
    }

}
