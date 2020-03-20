import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Optional } from "typescript-optional";
import { AbstractEntity } from "./AbstractEntity";
import { TranslationAttempt } from "./TranslationAttempt";

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

    allAnswersGiven(): boolean {
        return this.fetchFirstUnanswered().isEmpty();
    }

    fetchFirstUnanswered(): Optional<TranslationAttempt> {
        let unansweredTranslations: TranslationAttempt[] = this.translationAttempts
            .filter(translationAttempt => !translationAttempt.answerWasGiven && !translationAttempt.timedOut);
            
        let optional: Optional<TranslationAttempt>;
        if (unansweredTranslations.length == 0) {
            optional = Optional.empty();
        } else {
            optional = Optional.of(unansweredTranslations[0]);
        }

        return optional;
    }

    finish(): PracticeRun {
        this.status = Status.FINISHED;

        return this;
    }

    abort(): PracticeRun {
        this.status = Status.ABORTED;

        return this;
    }

    pause(): PracticeRun {
        this.status = Status.PAUSED;

        return this;
    }

    restart() {
        this.status = Status.RUNNING;

        return this;
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