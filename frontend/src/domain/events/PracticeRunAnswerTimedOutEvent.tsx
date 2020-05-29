export class PracticeRunAnswerTimedOutEvent {
    
    runId: string;
    name: string = "PracticeRunAnswerTimedOutEvent";

    constructor(runId: string) {
        this.runId = runId;
    }
}