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

    constructor(id: string, startDate: Date, lastActionDate: Date, status: Status, 
        translationAttempts: TranslationAttempt[]) {

        this.id = id;
        this.startDate = startDate;
        this.lastActionDate = lastActionDate;
        this.status = status;
        this.translationAttempts = translationAttempts;
    }

    static from(json: any): PracticeRun {
        
        return new PracticeRun(json.id, json.startDate, json.lastActionDate, 
            this.mapValueToStatus(json.status), TranslationAttempt.fromMany(json.translationAttempts));
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

