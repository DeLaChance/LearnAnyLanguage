import { Translation } from "./Translation";

export class TranslationAttempt {

    id: string;
    givenAnswer: string;
    answerWasGiven: boolean;
    timedOut: boolean;
    lastActionDate: Date;   
    correctAnswer: string;
    input: string;

    constructor(id: string, givenAnswer: string, answerWasGiven: boolean, timedOut: boolean, 
        lastActionDate: Date, correctAnswer: string, input: string) {

        this.id = id;
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
        return translationAttemptListJson.map((jsonArrayElement: any) => {
            const translationAttempt: TranslationAttempt | null = this.from(jsonArrayElement);
            if (translationAttempt) {
                return translationAttempt;
            }
        });
    }

    static from(json: any) {
        if (json == null) {
            return null;
        } else {
            return new TranslationAttempt(json.id, json.givenAnswer, json.answerWasGiven, 
                json.timedOut, json.lastActionDate, json.correctAnswer, json.input);
        }
    }
}