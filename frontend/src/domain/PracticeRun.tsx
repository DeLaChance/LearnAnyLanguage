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
    timePerWord: number;
    sourceToTarget: boolean;
    currentTranslation: TranslationAttempt | null;

    constructor(id: string, startDate: Date, lastActionDate: Date, status: Status, 
        translationAttempts: TranslationAttempt[], listId: string, timePerWord: number,
        currentTranslation: TranslationAttempt | null, sourceToTarget: boolean) {

        this.id = id;
        this.startDate = startDate;
        this.lastActionDate = lastActionDate;
        this.status = status;
        this.translationAttempts = translationAttempts;
        this.listId = listId;
        this.timePerWord = timePerWord;
        this.sourceToTarget = sourceToTarget;
        this.currentTranslation = currentTranslation;
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

    isPaused() {
        return this.status === Status.PAUSED;
    }

    isAborted() {
        return this.status === Status.ABORTED;
    }

    isFinished() {
        return this.status === Status.FINISHED;
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
            practiceRunJson.listId,
            practiceRunJson.timePerWord,
            TranslationAttempt.from(practiceRunJson.currentTranslation),
            practiceRunJson.sourceToTarget
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

