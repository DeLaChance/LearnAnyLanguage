export class PracticeRunStoppedEvent {

    runId: string;
    name: string = "PracticeRunStoppedEvent";

    constructor(runId: string, ) {
        this.runId = runId;
    }
}