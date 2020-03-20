import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { PracticeRunCreatedEvent } from "../../domain/events/PracticeRunCreatedEvent";
import { Inject } from "@nestjs/common";
import { PracticeRunService } from "../PracticeRunService";

@EventsHandler(PracticeRunCreatedEvent)
export class PracticeRunCreatedEventHandler implements IEventHandler<PracticeRunCreatedEvent> {
    
    @Inject()
    practiceRunService: PracticeRunService;

    handle(event: PracticeRunCreatedEvent) {
        this.practiceRunService.scheduleNextAnswerTimeout(event.runId);
    }

}
