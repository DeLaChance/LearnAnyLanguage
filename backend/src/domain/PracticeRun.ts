import { PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { PracticeList } from "./PracticeList";
import { Translation } from "./Translation";
import { TranslationAttempt } from "./TranslationAttempt";
import { Exclude } from "class-transformer";
import { Optional } from "typescript-optional";

/**
 * A {@link PracticeRun} is an assessment of all {@link Translation}'s (word pairs) in a {@link PracticeList}.
 */
@Entity()
export class PracticeRun implements AbstractEntity<string> {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    startDate: Date;

    @UpdateDateColumn()
    lastActionDate: Date;

    @Column('text', { nullable: false})
    status: Status;

    @OneToMany(type => TranslationAttempt, attempt => attempt.practiceRun, { eager: true })
    @JoinColumn()
    translationAttempts: TranslationAttempt[];

    getID(): string {
        return this.id;
    }

    fetchFirstUnanswered(): Optional<TranslationAttempt> {
        let unansweredTranslations: TranslationAttempt[] = this.translationAttempts
            .filter(translationAttempt => !translationAttempt.answerWasGiven);
            
        let optional: Optional<TranslationAttempt>;
        if (unansweredTranslations.length == 0) {
            optional = Optional.empty();
        } else {
            optional = Optional.of(unansweredTranslations[0]);
        }

        return optional;
    }

    isFinished(): boolean {
        return (this.status == Status.ABORTED || this.status == Status.FINISHED);
    }
}

export enum Status {
    RUNNING = 'running',
    PAUSED = 'paused',
    ABORTED = 'aborted',
    FINISHED = 'finished'
}