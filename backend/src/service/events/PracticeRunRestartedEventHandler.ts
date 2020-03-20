import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PracticeRunService } from "../PracticeRunService";
import { PracticeRunRestartedEvent } from "../../domain/events/PracticeRunRestartedEvent";

@EventsHandler(PracticeRunRestartedEvent)
export class PracticeRunRestartedEventHandler implements IEventHandler<PracticeRunRestartedEvent> {
    
    @Inject()
    practiceRunService: PracticeRunService;

    handle(event: PracticeRunRestartedEvent) {
        this.practiceRunService.scheduleNextAnswerTimeout(event.runId);
    }

}
