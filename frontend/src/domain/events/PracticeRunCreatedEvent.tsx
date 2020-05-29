export class PracticeRunCreatedEvent {

    runId: string;
    name: string = "PracticeRunCreatedEvent";

    constructor(runId: string) {
        this.runId = runId;
    }
}