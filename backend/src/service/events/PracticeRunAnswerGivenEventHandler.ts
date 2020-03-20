import { PracticeRunAnswerGivenEvent } from "../../domain/events/PracticeRunAnswerGivenEvent";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { PracticeRunService } from "../PracticeRunService";
import { Inject } from "@nestjs/common";

@EventsHandler(PracticeRunAnswerGivenEvent)
export class PracticeRunAnswerGivenEventHandler implements IEventHandler<PracticeRunAnswerGivenEvent> {

    @Inject()
    practiceRunService: PracticeRunService;

    handle(event: PracticeRunAnswerGivenEvent) {
        this.practiceRunService.scheduleNextAnswerTimeout(event.runId);
    }
    
}