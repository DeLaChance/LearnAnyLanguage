import { Translation } from "./Translation";

export class TranslationAttempt {

    id: string;
    translation: Translation;
    answer: string;
    answerWasGiven: boolean;
    timedOut: boolean;
    lastActionDate: Date;   

    constructor(id: string, translation: Translation, answer: string, answerWasGiven: boolean, timedOut: boolean, lastActionDate: Date) {
        this.id = id;
        this.translation = translation;
        this.answer = answer;
        this.answerWasGiven = answerWasGiven;
        this.timedOut = timedOut;
        this.lastActionDate = lastActionDate;        
    }

    static fromMany(translationAttemptListJson: any): TranslationAttempt[] {
        return translationAttemptListJson.map((jsonArrayElement: any) => this.from(jsonArrayElement));

    }

    static from(json: any) {
        return new TranslationAttempt(json.id, Translation.from(json.translation), 
            json.answer, json.answerWasGiven, json.timedOut, json.lastActionDate);
    }
}