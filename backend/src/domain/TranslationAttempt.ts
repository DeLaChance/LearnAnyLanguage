import { AbstractEntity } from "./AbstractEntity";
import { PrimaryGeneratedColumn, ManyToOne, Column, UpdateDateColumn, Entity } from "typeorm";
import { Translation } from "./Translation";
import { PracticeRun } from "./PracticeRun";
import { Exclude, Transform } from "class-transformer";

/**
 * A {@link TranslationAttempt} is an assessment of an individual {@link Translation}.
 */
@Entity()
export class TranslationAttempt implements AbstractEntity<string> {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => Translation, translation => translation.translationAttempts, { eager: false })
    translation: Translation;

    @Column({ nullable: true })
    answer: string;

    @Column()
    answerWasGiven: boolean;

    @ManyToOne(type => PracticeRun, practiceRun => practiceRun.translationAttempts, { eager: false })
    @Transform(practiceRun => practiceRun.id)
    practiceRun: PracticeRun;

    @UpdateDateColumn()
    lastActionDate: Date;    

    getID(): string {
        return this.id;
    }

    isCorrectAnswer() {
        // TODO: simple matching, can do more refined stuff
        return this.answer === this.translation.target.value;
    }

    giveAnswer(answer: string): TranslationAttempt {
        this.answer = answer;
        this.answerWasGiven = true;

        return this;
    }    
}
