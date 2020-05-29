import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Optional } from "typescript-optional";
import { AbstractEntity } from "./AbstractEntity";
import { TranslationAttempt } from "./TranslationAttempt";
import { CreatePracticeRunCommand } from "./commands/CreatePracticeRunCommand";
import { Transform } from "class-transformer";

/**
 * A {@link PracticeRun} is an assessment of all {@link Translation}'s (word pairs) in a {@link PracticeList}.
 */
@Entity()
export class PracticeRun implements AbstractEntity<string> {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Transform(date => date == null ? null : date.valueOf())
    @CreateDateColumn()
    startDate: Date;

    @UpdateDateColumn()
    lastActionDate: Date;

    @Column({ nullable: false})
    listId: string;

    @Column('text', { nullable: false})
    status: Status;

    @Column({ nullable: false })
    timePerWord: number;

    @Column()
    sourceToTarget: boolean;

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

    static createNew(command: CreatePracticeRunCommand): PracticeRun {
        let practiceRun: PracticeRun = new PracticeRun();
        
        practiceRun.status = Status.RUNNING;
        practiceRun.listId = command.listId;
        practiceRun.sourceToTarget = command.configuration.sourceToTarget;
        practiceRun.timePerWord = command.configuration.timePerWord; 

        return practiceRun;
    }

}

export enum Status {
    RUNNING = 'running',
    PAUSED = 'paused',
    ABORTED = 'aborted',
    FINISHED = 'finished'
}