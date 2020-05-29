export class PracticeRunPausedEvent {
    
    runId: string;
    name: string = "PracticeRunPausedEvent";

    constructor(runId: string) {
        this.runId = runId;
    }
}