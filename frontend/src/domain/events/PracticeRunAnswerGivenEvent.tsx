export class PracticeRunAnswerGivenEvent {

    runId: string;    
    name: string = "PracticeRunAnswerGivenEvent";

    constructor(runId: string) {
        this.runId = runId;
    }
}