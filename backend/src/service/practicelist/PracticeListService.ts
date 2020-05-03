import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from 'typeorm';
import { TranslationDto } from "../../adapter/http/dto/TranslationDto";
import { PracticeList } from "../../domain/PracticeList";
import { Translation } from "../../domain/Translation";
import { Word } from "../../domain/Word";
import { Language } from "../../domain/Language";

@Injectable()
export class PracticeListService extends TypeOrmCrudService<PracticeList> {

    @InjectRepository(Language)
    languageRepo: Repository<Language>;
    
    @InjectRepository(Word)
    wordRepo: Repository<Word>;

    @InjectRepository(Translation)
    translationRepo: Repository<Translation>

    @InjectRepository(PracticeList)
    practiceListRepo: Repository<PracticeList>;

    constructor(@InjectRepository(PracticeList) repo: Repository<PracticeList>) {
        super(repo);
    }
    
    async addTranslation(listId: string, translationDto: TranslationDto): Promise<PracticeList> {
        let practiceList: PracticeList = await this.repo.findOneOrFail(listId);
        
        let sourceWord: Word = Word.from(translationDto.source, practiceList.source);
        let targetWord: Word = Word.from(translationDto.target, practiceList.source);
        sourceWord = await this.wordRepo.save(sourceWord);
        targetWord = await this.wordRepo.save(targetWord);

        let translation: Translation = Translation.from(sourceWord, targetWord, practiceList);
        translation = await this.translationRepo.save(translation);

        practiceList.translations.push(translation);
        practiceList = await this.repo.save(practiceList);

        return Promise.resolve(practiceList);
    }

    async deleteTranslation(listId: string, translationId: number): Promise<PracticeList> {
        await this.translationRepo.delete(translationId);

        let practiceList: PracticeList = await this.repo.findOneOrFail(listId);
        return Promise.resolve(practiceList);
    }

    async editTranslation(listId: string, translationId: number, translationDto: TranslationDto) {
        let translation: Translation = await this.translationRepo.findOneOrFail(translationId);

        let sourceWord: Word = translation.source;
        sourceWord.value = translationDto.source;
        this.wordRepo.save(sourceWord);

        let targetWord: Word = translation.target;
        targetWord.value = translationDto.target;
        this.wordRepo.save(targetWord);

        let practiceList: PracticeList = await this.repo.findOneOrFail(listId);
        return Promise.resolve(practiceList);
    }
}