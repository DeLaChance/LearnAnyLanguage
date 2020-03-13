import { PracticeRun, Status } from '../domain/PracticeRun';
import { Injectable, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from 'typeorm';
import { PracticeList } from '../domain/PracticeList';
import { TranslationAttempt } from '../domain/TranslationAttempt';
import { Translation } from '../domain/Translation';

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

        return Promise.resolve(practiceRun);
    }

    async mapToTranslationAttempt(translation: Translation, practiceRun: PracticeRun): Promise<TranslationAttempt> {
        let translationAttempt: TranslationAttempt = new TranslationAttempt();
        translationAttempt.practiceRun = practiceRun;
        translationAttempt.translation = translation;
        translationAttempt.answerWasGiven = false;

        return this.translationAttemptRepo.save(translationAttempt);
    }
}