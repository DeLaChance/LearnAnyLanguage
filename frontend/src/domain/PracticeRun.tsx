import { TranslationAttempt } from "./TranslationAttempt";

enum Status {
    RUNNING = 'running',
    PAUSED = 'paused',
    ABORTED = 'aborted',
    FINISHED = 'finished',
    UNKNOWN = 'unknown'
}

export class PracticeRun {
    
    id: string;
    startDate: Date;
    lastActionDate: Date;
    status: Status;
    translationAttempts: TranslationAttempt[];
    listId: string;

    constructor(id: string, startDate: Date, lastActionDate: Date, status: Status, 
        translationAttempts: TranslationAttempt[], listId: string) {

        this.id = id;
        this.startDate = startDate;
        this.lastActionDate = lastActionDate;
        this.status = status;
        this.translationAttempts = translationAttempts;
        this.listId = listId;
    }

    determineProgressCount(): number {
        return this.translationAttempts
            .filter(translationAttempt => translationAttempt.answerWasGiven || translationAttempt.timedOut)
            .length;
    }

    determineTotalCount(): number {
        return this.translationAttempts.length;
    }

    isActive() {
        return this.status === Status.RUNNING;
    }

    determineWrongAnswersCount(): number {
        return this.translationAttempts.filter(translationAttempt => translationAttempt.isWrong()).length;
    }

    determineCorrectAnswersCount(): number {
        return this.translationAttempts.filter(translationAttempt => translationAttempt.isCorrect()).length;
    }

    static fromMany(practiceRunListJson: any): PracticeRun[] {
        return practiceRunListJson.map((practiceRunJson: any) => this.from(practiceRunJson));
    }

    static from(practiceRunJson: any): PracticeRun {        
        return new PracticeRun(
            practiceRunJson.id, 
            new Date(practiceRunJson.startDate), 
            new Date(practiceRunJson.lastActionDate), 
            this.mapValueToStatus(practiceRunJson.status),             
            TranslationAttempt.fromMany(practiceRunJson.translationAttempts),
            practiceRunJson.listId
        );
    }

    static mapValueToStatus(value: string): Status {
        
        let status: Status | undefined = Object.values(Status)                        
            .find(keyValue => keyValue === value);
        if (status) {
            return status;
        } else {
            return Status.UNKNOWN;
        }        
    }
}

