import { PracticeRunAnswerTimedOutEvent } from "../../domain/events/PracticeRunAnswerTimedOutEvent";
import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { PracticeRunService } from "../PracticeRunService";
import { Inject } from "@nestjs/common";

@EventsHandler(PracticeRunAnswerTimedOutEvent)
export class PracticeRunAnswerTimedOutEventHandler implements IEventHandler<PracticeRunAnswerTimedOutEvent> {

    @Inject()
    practiceRunService: PracticeRunService;

    handle(event: PracticeRunAnswerTimedOutEvent) {
        this.practiceRunService.scheduleNextAnswerTimeout(event.runId);
    }
    
}