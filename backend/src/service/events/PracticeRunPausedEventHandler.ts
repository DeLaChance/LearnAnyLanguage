import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PracticeRunPausedEvent } from "../../domain/events/PracticeRunPausedEvent";
import { PracticeRunService } from "../PracticeRunService";

@EventsHandler(PracticeRunPausedEvent)
export class PracticeRunPausedEventHandler implements IEventHandler<PracticeRunPausedEvent> {
    
    @Inject()
    practiceRunService: PracticeRunService;

    handle(event: PracticeRunPausedEvent) {
        // TODO: forward to websocket
    }

}