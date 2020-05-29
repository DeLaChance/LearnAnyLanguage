export class PracticeRunRestartedEvent {
    
    runId: string;
    name: string = "PracticeRunRestartedEvent";

    constructor(runId: string) {
        this.runId = runId;
    }
}