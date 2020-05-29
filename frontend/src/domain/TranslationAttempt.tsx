import { Translation } from "./Translation";

export class TranslationAttempt {

    id: string;
    translation: Translation;
    givenAnswer: string;
    answerWasGiven: boolean;
    timedOut: boolean;
    lastActionDate: Date;   
    correctAnswer: string;
    input: string;

    constructor(id: string, translation: Translation, givenAnswer: string, answerWasGiven: boolean, 
        timedOut: boolean, lastActionDate: Date, correctAnswer: string, input: string) {

        this.id = id;
        this.translation = translation;
        this.givenAnswer = givenAnswer;
        this.answerWasGiven = answerWasGiven;
        this.timedOut = timedOut;
        this.lastActionDate = lastActionDate;
        this.correctAnswer = correctAnswer;
        this.input = input;
    }

    isCorrect() {
        return this.answerWasGiven && !this.timedOut &&
            this.correctAnswer === this.givenAnswer;
    }

    isWrong() {
        return (this.answerWasGiven && this.correctAnswer !== this.givenAnswer) || this.timedOut;
    }

    static fromMany(translationAttemptListJson: any): TranslationAttempt[] {
        return translationAttemptListJson.map((jsonArrayElement: any) => this.from(jsonArrayElement));

    }

    static from(json: any) {
        return new TranslationAttempt(json.id, Translation.from(json.translation), 
            json.givenAnswer, json.answerWasGiven, json.timedOut, json.lastActionDate, 
            json.correctAnswer, json.input);
    }
}