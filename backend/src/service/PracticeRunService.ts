import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventBus } from '@nestjs/cqrs';
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from 'typeorm';
import { Optional } from 'typescript-optional';
import { CreatePracticeRunCommand } from '../domain/commands/CreatePracticeRunCommand';
import { PracticeRunAnswerGivenEvent } from '../domain/events/PracticeRunAnswerGivenEvent';
import { PracticeRunAnswerTimedOutEvent } from '../domain/events/PracticeRunAnswerTimedOutEvent';
import { PracticeRunCreatedEvent } from '../domain/events/PracticeRunCreatedEvent';
import { PracticeRunRestartedEvent } from '../domain/events/PracticeRunRestartedEvent';
import { PracticeRunStoppedEvent } from '../domain/events/PracticeRunStoppedEvent';
import { PracticeList } from '../domain/PracticeList';
import { PracticeRun, Status } from '../domain/PracticeRun';
import { Translation } from '../domain/Translation';
import { TranslationAttempt } from '../domain/TranslationAttempt';
import { WebSocketAdapter } from "../adapter/websocket/WebSocketAdapter";
import { PracticeRunAnswerCreatedEvent } from "../domain/events/PracticeRunAnswerCreatedEvent";
import { PracticeRunPausedEvent } from "../domain/events/PracticeRunPausedEvent";

const NOTIFICATION_FREQUENCY_MILLIS: number = 100;
const MILLIS_PER_SECOND: number = 1000;
const TIME_BETWEEN_ANSWERS_MILLIS: number = 2000;

@Injectable()
export class PracticeRunService extends TypeOrmCrudService<PracticeRun> {

    @InjectRepository(PracticeList)
    practiceListRepo: Repository<PracticeList>;

    @InjectRepository(TranslationAttempt)
    translationAttemptRepo: Repository<TranslationAttempt>;

    @Inject()
    eventBus: EventBus;

    @Inject()
    websocketAdapter: WebSocketAdapter;

    @Inject()
    schedulerRegistry: SchedulerRegistry;

    constructor(@InjectRepository(PracticeRun) repo: Repository<PracticeRun>) {
        super(repo);
    }

    async start(command: CreatePracticeRunCommand): Promise<PracticeRun> {
        let practiceList: PracticeList = await this.practiceListRepo.findOneOrFail(command.listId);

        let practiceRun: PracticeRun = PracticeRun.createNew(command);
        practiceRun = await this.repo.save(practiceRun);

        let translationAttempts: TranslationAttempt[] = await Promise.all(practiceList.translations
            .map(translation => this.mapToTranslationAttempt(translation, practiceRun))
        );
        practiceRun.translationAttempts = this.shuffle(translationAttempts);

        // TODO: can this be done in one save-action?
        practiceRun = await this.repo.save(practiceRun);

        practiceList.runsCount += 1;
        practiceList = await this.practiceListRepo.save(practiceList);

        Logger.log(`Created a practice run '${practiceRun.id}' for practice list '${practiceList.id}'`);
        this.publishPracticeRunCreatedEvent(practiceRun.id);

        return Promise.resolve(practiceRun);
    }

    async finish(runId: string): Promise<PracticeRun> {
        let practiceRun: PracticeRun = await this.repo.findOneOrFail(runId);
        practiceRun.finish();
        practiceRun = await this.repo.save(practiceRun);

        Logger.log(`Finished practice run '${practiceRun.id}'`);
        this.publishPracticeRunStoppedEvent(practiceRun.id, Status.FINISHED);

        return Promise.resolve(practiceRun);        
    }

    async pause(runId: string): Promise<PracticeRun> {
        let practiceRun: PracticeRun = await this.repo.findOneOrFail(runId);
        practiceRun.pause();
        this.cancelExistingTimeOut(runId);
        practiceRun = await this.repo.save(practiceRun);

        Logger.log(`Paused practice run '${practiceRun.id}'`);
        this.publishPracticeRunPausedEvent(practiceRun.id);

        return Promise.resolve(practiceRun);
    }

    async abort(runId: string): Promise<PracticeRun> {
        let practiceRun: PracticeRun = await this.repo.findOneOrFail(runId);
        practiceRun.abort();
        this.cancelExistingTimeOut(runId);
        practiceRun = await this.repo.save(practiceRun);

        Logger.log(`Aborted practice run '${practiceRun.id}'`);
        this.publishPracticeRunStoppedEvent(practiceRun.id, Status.ABORTED);

        return Promise.resolve(practiceRun);
    }

    async restart(runId: string): Promise<PracticeRun> {
        let practiceRun: PracticeRun = await this.repo.findOneOrFail(runId);

        let promise: Promise<PracticeRun>;
        if (practiceRun.allAnswersGiven()) {
            promise = Promise.reject("Practice run is already complete");
        } else if (practiceRun.status != Status.PAUSED) {
            promise = Promise.reject(`Practice run is not paused, but state is ${practiceRun.status}`);            
        } else {
            practiceRun.restart();
            practiceRun = await this.repo.save(practiceRun);
            Logger.log(`Restarted practice run '${practiceRun.id}'`);

            this.publishPracticeRunRestartedEvent(runId);
            promise = Promise.resolve(practiceRun);
        }

        return promise;
    }

    async giveAnswer(runId: string, answer: string): Promise<TranslationAttempt> {

        let practiceRun: PracticeRun = await this.repo.findOneOrFail(runId);
        let optional: Optional<TranslationAttempt> = practiceRun.fetchFirstUnanswered();

        let promise: Promise<TranslationAttempt>;
        if (optional.isPresent()) {
            let translationAttempt: TranslationAttempt = optional.get();
            translationAttempt = translationAttempt.giveAnswer(answer);
            translationAttempt = await this.translationAttemptRepo.save(translationAttempt);
            
            this.cancelExistingTimeOut(runId);

            let correctAnswer: string = translationAttempt.correctAnswer;
            let isCorrectAnswer = correctAnswer === answer;

            Logger.log(`Answer (id=${translationAttempt.id}, actual='${answer}',expected='${correctAnswer}',` +
                `correct='${isCorrectAnswer}') was given to practice run '${practiceRun.id}'`);
            
            practiceRun = await this.repo.findOneOrFail(runId);
            if (practiceRun.allAnswersGiven()) {
                await this.finish(practiceRun.id);
            } else {
                this.publishPracticeRunAnswerGivenEvent(practiceRun.id);                
            }

            promise = Promise.resolve(translationAttempt);
        } else {
            promise = Promise.reject("All answers have already been given or timed out.");
        }

        return promise;
    }

    async timeOutAnswer(runId: string): Promise<TranslationAttempt> {
        let practiceRun: PracticeRun = await this.repo.findOneOrFail(runId);
        
        let promise: Promise<TranslationAttempt>;
        let optional: Optional<TranslationAttempt> = practiceRun.fetchFirstUnanswered();
        if (optional.isPresent()) {
            let translationAttempt: TranslationAttempt = optional.get();
            translationAttempt = translationAttempt.timeOut();
            translationAttempt = await this.translationAttemptRepo.save(translationAttempt);

            Logger.log(`Answer timeout for run ${practiceRun.id}: expected='${translationAttempt.correctAnswer}`);            
            this.cancelExistingTimeOut(runId);

            practiceRun = await this.repo.findOneOrFail(runId);
            if (practiceRun.allAnswersGiven()) {
                await this.finish(practiceRun.id);
            } else {
                this.publishPracticeRunAnswerTimedOutEvent(practiceRun.id);
            }

            promise = Promise.resolve(translationAttempt);
        } else {
            promise = Promise.reject("All answers have already been given or timed out.");
        }

        return promise;
    }

    scheduleNextAnswerTimeout(runId: string) {
        const callback: (() => void) = () => {
            this.scheduleNextAnswerTimeOut(runId);
        };
        const timeout = setTimeout(callback, TIME_BETWEEN_ANSWERS_MILLIS);        
        this.schedulerRegistry.addTimeout(runId, timeout);
    }    

    private publishPracticeRunCreatedEvent(runId: string) {
        let event: PracticeRunCreatedEvent = new PracticeRunCreatedEvent();        
        event.runId = runId;
        this.eventBus.publish(event);
    }

    private publishPracticeRunAnswerCreatedEvent(runId: string) {
        let event: PracticeRunAnswerCreatedEvent = new PracticeRunAnswerCreatedEvent();
        event.runId = runId;
        this.eventBus.publish(event);
    }

    private publishPracticeRunAnswerGivenEvent(runId: string) {
        let event: PracticeRunAnswerGivenEvent = new PracticeRunAnswerGivenEvent();
        event.runId = runId;
        this.eventBus.publish(event);
    }

    private publishPracticeRunAnswerTimedOutEvent(runId: string) {
        let event: PracticeRunAnswerTimedOutEvent = new PracticeRunAnswerTimedOutEvent();
        event.runId = runId;
        this.eventBus.publish(event);
    }
    
    private publishPracticeRunStoppedEvent(runId: string, newState: Status) {
        let event: PracticeRunStoppedEvent = new PracticeRunStoppedEvent();
        event.runId = runId;
        event.newState = newState;
        this.eventBus.publish(event);
    }

    private publishPracticeRunPausedEvent(runId: string) {
        let event: PracticeRunPausedEvent = new PracticeRunPausedEvent();
        event.runId = runId;
        this.eventBus.publish(event);
    }

    private publishPracticeRunRestartedEvent(runId: string) {
        let event: PracticeRunRestartedEvent = new PracticeRunRestartedEvent();
        event.runId = runId;
        this.eventBus.publish(event);
    }

    private async mapToTranslationAttempt(translation: Translation, practiceRun: PracticeRun): 
        Promise<TranslationAttempt> {

        let translationAttempt: TranslationAttempt = new TranslationAttempt();
        translationAttempt.practiceRun = practiceRun;
        translationAttempt.translation = translation;
        translationAttempt.correctAnswer = translation.determineCorrectAnswer(practiceRun.sourceToTarget);
        translationAttempt.input = translation.determineSource(practiceRun.sourceToTarget);
        translationAttempt.timedOut = false;
        translationAttempt.answerWasGiven = false;

        return this.translationAttemptRepo.save(translationAttempt);
    }

    private cancelExistingTimeOut(runId: string) {
        this.schedulerRegistry.deleteInterval(runId);
    }

    private async scheduleNextAnswerTimeOut(runId: string) {
        const generateIntervalCallback = (timeOutInMillis: number) => {
            let timeSpentOnCurrentWord: number = 0;
            return () => {
                timeSpentOnCurrentWord += NOTIFICATION_FREQUENCY_MILLIS;
                if (timeSpentOnCurrentWord >= timeOutInMillis) {
                    this.timeOutAnswer(runId);
                } else {
                    this.sendRunningTestNotification(runId, timeSpentOnCurrentWord);
                }
            }
        };

        const betweenAnswersTimeout: any = this.schedulerRegistry.getTimeout(runId)
        if (betweenAnswersTimeout) {
            this.schedulerRegistry.deleteTimeout(runId);
        }

        let practiceRun: PracticeRun = await this.repo.findOneOrFail(runId);
        const timeOutInMillis = practiceRun.timePerWord * MILLIS_PER_SECOND;
        
        const callback: (() => void) = generateIntervalCallback(timeOutInMillis);
        const intervalId = setInterval(callback, NOTIFICATION_FREQUENCY_MILLIS);
        this.schedulerRegistry.addInterval(runId, intervalId);

        Logger.log(`Scheduling answer timeout for run='${runId}' in ${timeOutInMillis}ms.`);
        this.publishPracticeRunAnswerCreatedEvent(runId);
    }

    private sendRunningTestNotification(runId: string, timeSpentOnCurrentWord: number) {
        this.websocketAdapter.sendNotification(runId, timeSpentOnCurrentWord);
    }

    private shuffle(array: any[]): any[] {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
}