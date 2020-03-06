import { InjectRepository } from "@nestjs/typeorm";
import fs from "fs-extra";
import { Repository } from "typeorm";
import { Language } from "../../domain/Language";
import { PracticeList } from "../../domain/PracticeList";
import { Translation } from "../../domain/Translation";
import { Word } from "../../domain/Word";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PracticeListFileImporter {

    static readonly ARROW_SEPERATOR: string = " -> ";

    @InjectRepository(Language)
    languageRepo: Repository<Language>;
    
    @InjectRepository(Word)
    wordRepo: Repository<Word>;

    @InjectRepository(Translation)
    translationRepo: Repository<Translation>

    @InjectRepository(PracticeList)
    practiceListRepo: Repository<PracticeList>;

    public importFile(filePath: string): Promise<PracticeList> {
        return fs.readFile(filePath, "UTF-8")
            .then(fileContents => this.parseFile(fileContents))
            .then(practiceList => {
                console.log(`Practice list with id='${practiceList.id}' created.`);
                return Promise.resolve(practiceList);
            });
    }

    private async parseFile(fileContents: string): Promise<PracticeList> {
        let lines: string[] = fileContents.replace("\r", "")
            .split("\n")
            .filter(line => line !== "");
        
        if (lines.length < 3) {
            throw new Error("File is too short. Needs name, language 1 and language 2 on first 3 lines.")
        }

        let listName: string = lines[0];
        let sourceLanguage: Language = await this.languageRepo.findOneOrFail(lines[1].trim());
        let targetLanguage: Language = await this.languageRepo.findOneOrFail(lines[2].trim());

        if (listName === "") {
            throw new Error(`List name cannot be empty`);
        } else if (sourceLanguage === null) {
            throw new Error(`Language ${sourceLanguage} is unknown`);
        } else if (targetLanguage === null) {
            throw new Error(`Language ${targetLanguage} is unknown`);
        }

        let practiceList: PracticeList = new PracticeList();
        practiceList.name = listName.trim();
        practiceList.source = sourceLanguage;
        practiceList.target = targetLanguage;
        practiceList = await this.practiceListRepo.save(practiceList);

        let translations: Translation[] = [];
        lines.forEach(async (line, index) => {
            if (index <= 2) {
                return;
            }

            let translation: Translation = await this.parseLine(line, sourceLanguage, targetLanguage, practiceList);
            translations.push(translation);
        });

        practiceList.translations = translations;
        practiceList = await this.practiceListRepo.save(practiceList);

        return Promise.resolve(practiceList);
    }

    private async parseLine(line: string, sourceLanguage: Language, targetLanguage: Language, practiceList: PracticeList): Promise<Translation> {
        let translatableWordPair: string[] = line.split(PracticeListFileImporter.ARROW_SEPERATOR);
        
        let promise: Promise<Translation>;
        if (translatableWordPair.length != 2) {
            promise = Promise.reject("Line needs to follow pattern: A -> B");
        }

        let sourceWord: Word = await this.createWord(translatableWordPair[0].trim(), sourceLanguage);
        let targetWord: Word = await this.createWord(translatableWordPair[1].trim(), targetLanguage);

        let translation: Translation = new Translation();
        translation.source = sourceWord;
        translation.target = targetWord;
        translation.practiceList = practiceList;
        
        translation = await this.translationRepo.save(translation);

        return Promise.resolve(translation);
    }

    private async createWord(wordString: string, wordLanguage: Language): Promise<Word> {
        let word: Word = new Word();
        word.language = wordLanguage;
        word.value = wordString;

        word = await this.wordRepo.save(word);
        return Promise.resolve(word);
    }
}