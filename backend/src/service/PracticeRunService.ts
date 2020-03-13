import { PracticeRun, Status } from '../domain/PracticeRun';
import { Injectable, Post, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from 'typeorm';
import { PracticeList } from '../domain/PracticeList';
import { TranslationAttempt } from '../domain/TranslationAttempt';
import { Translation } from '../domain/Translation';
import { Optional } from 'typescript-optional';

@Injectable()
export class PracticeRunService extends TypeOrmCrudService<PracticeRun> {

    @InjectRepository(PracticeList)
    practiceListRepo: Repository<PracticeList>;

    @InjectRepository(TranslationAttempt)
    translationAttemptRepo: Repository<TranslationAttempt>;

    constructor(@InjectRepository(PracticeRun) repo: Repository<PracticeRun>) {
        super(repo);
    }

    async start(listId: string): Promise<PracticeRun> {
        let practiceList: PracticeList = await this.practiceListRepo.findOneOrFail(listId);
        
        let practiceRun: PracticeRun = new PracticeRun();
        practiceRun.status = Status.RUNNING;
        practiceRun = await this.repo.save(practiceRun);

        practiceRun.translationAttempts = await Promise.all(practiceList.translations
            .map(translation => this.mapToTranslationAttempt(translation, practiceRun)));

        Logger.log(`Created a practice run '${practiceRun.id}' for practice list '${practiceList.id}'`);

        return Promise.resolve(practiceRun);
    }

    async giveAnswer(runId: string, answer: string): Promise<TranslationAttempt> {

        let practiceRun: PracticeRun = await this.repo.findOneOrFail(runId);
        let optional: Optional<TranslationAttempt> = practiceRun.fetchFirstUnanswered();

        let promise: Promise<TranslationAttempt>;
        if (optional.isPresent()) {
            let translationAttempt: TranslationAttempt = optional.get();
            translationAttempt = translationAttempt.giveAnswer(answer);
            translationAttempt = await this.translationAttemptRepo.save(translationAttempt);

            Logger.log(`Answer (answer='${answer}',expected='${translationAttempt.answer}',` +
                `correct='${translationAttempt.isCorrectAnswer()}') was given to practice run '${practiceRun.id}'`);
            promise = Promise.resolve(translationAttempt);
        } else {
            promise = Promise.reject("All answers have already been given.");
        }

        return promise;
    }

    async mapToTranslationAttempt(translation: Translation, practiceRun: PracticeRun): Promise<TranslationAttempt> {
        let translationAttempt: TranslationAttempt = new TranslationAttempt();
        translationAttempt.practiceRun = practiceRun;
        translationAttempt.translation = translation;
        translationAttempt.answerWasGiven = false;

        return this.translationAttemptRepo.save(translationAttempt);
    }
}