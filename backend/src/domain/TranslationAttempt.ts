import { AbstractEntity } from "./AbstractEntity";
import { PrimaryGeneratedColumn, ManyToOne, Column, UpdateDateColumn, Entity } from "typeorm";
import { Translation } from "./Translation";
import { PracticeRun } from "./PracticeRun";
import { Exclude, Transform, Expose } from "class-transformer";

/**
 * A {@link TranslationAttempt} is an assessment of an individual {@link Translation}.
 */
@Entity()
export class TranslationAttempt implements AbstractEntity<string> {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => Translation, translation => translation.translationAttempts, { eager: true })
    @Exclude()
    translation: Translation;

    @Column({ nullable: true })
    givenAnswer: string;

    @Column({ nullable: false })
    input: string;

    @Column({ nullable: false })
    correctAnswer: string;

    @Column()
    answerWasGiven: boolean;

    @Column()
    timedOut: boolean;

    @Exclude()
    @ManyToOne(type => PracticeRun, practiceRun => practiceRun.translationAttempts, { eager: false })
    practiceRun: PracticeRun;

    @UpdateDateColumn()
    lastActionDate: Date;    

    getID(): string {
        return this.id;
    }

    giveAnswer(answer: string): TranslationAttempt {
        this.givenAnswer = answer;
        this.timedOut = false;
        this.answerWasGiven = true;

        return this;
    }    

    timeOut(): TranslationAttempt {
        this.givenAnswer = "";
        this.timedOut = true;
        this.answerWasGiven = false;
        
        return this;
    }

}
