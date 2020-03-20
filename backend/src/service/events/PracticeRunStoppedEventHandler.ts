import { IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { PracticeRunCreatedEvent } from "../../domain/events/PracticeRunCreatedEvent";
import { Inject } from "@nestjs/common";
import { PracticeRunService } from "../PracticeRunService";
import { PracticeRunStoppedEvent } from "../../domain/events/PracticeRunStoppedEvent";

@EventsHandler(PracticeRunStoppedEvent)
export class PracticeRunStoppedEventHandler implements IEventHandler<PracticeRunStoppedEvent> {
    
    @Inject()
    practiceRunService: PracticeRunService;

    handle(event: PracticeRunStoppedEvent) {
        // TODO: forward to websocket
    }

}
