export class PracticeRunConfiguration {

    listId: string;
    timePerWord: number;
    sourceToTarget: boolean;

    constructor(listId: string, timePerWord: number, sourceToTarget: boolean) {
        this.listId = listId;
        this.timePerWord = timePerWord;
        this.sourceToTarget = sourceToTarget;
    }

}