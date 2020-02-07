import { Repository } from '../Repository';
import { Language } from '../../domain/Language';
import { Logger } from '../../util/Logger';

import fs from 'fs-extra';

import config from '../../config/config.json'
import { deserializeArray, serialize } from "class-transformer";
import { Optional } from 'typescript-optional';

class FileBasedLanguageRepository extends Repository<Language, string> {

    private location: string;
    private languagesMap: Map<String, Language>;
    
    constructor() {
        super();
        this.location = config.repos.language.location;
        this.languagesMap = new Map();

        this.initialize();
    }

    findAll(): Promise<Language[]> {
        return new Promise<Language[]>((resolve, reject) => {
            if (this.languagesMap.size == 0) {
                reject("Cache not yet loaded.");
            } else {
                resolve(Array.from(this.languagesMap.values()));
            }
        });
    } 
    
    findById(id: string): Promise<Optional<Language>> {
        return new Promise<Optional<Language>>((resolve, reject) => {
            let optional: Optional<Language> = this.tryFindById(id);
            return resolve(optional);
        });
    }

    save(language: Language): Promise<Language> {
        this.languagesMap.set(language.iso2Code, language);
        return this.writeCache()
            .then(() => Promise.resolve(language));
    }

    delete(id: string): Promise<Language> {
        let optional: Optional<Language> = this.tryFindById(id);

        if (optional.isPresent()) {
            this.languagesMap.delete(id);
            return this.writeCache()
                .then(() => Promise.resolve(optional.get()));
        } else {
            return Promise.reject("No language with iso2Code '" + id + "'");
        }
    }

    private initialize(): void {
        this.ensureRepoExists()
            .then(() => this.readRepoFile())
            .then(fileContents => this.readCache(fileContents))
            .then(() => Logger.log("FileBasedLanguageRepository initialized under directory %s ", this.location))
            .catch(reason => Logger.error("FileBasedLanguageRepository not initialized due to: '%s'", reason));           
    }

    private ensureRepoExists(): Promise<void> {
        return fs.ensureFile(this.location);
    }

    private readRepoFile(): Promise<string> {
        return fs.readFile(this.location, "UTF-8");
    }

    private readCache(fileContents: string): Promise<void> {
        let languages: Language[] = deserializeArray(Language, fileContents);
        languages.forEach(language => this.languagesMap.set(language.iso2Code, language));
        return Promise.resolve();
    }

    private writeCache(): Promise<void> {
        let fileContents: string = serialize(Array.from(this.languagesMap.values()));
        return fs.writeFile(this.location, fileContents);            
    }

    private tryFindById(id: String): Optional<Language> {
        return Optional.ofNullable(this.languagesMap.get(id));
    }
}

const languageRepository = new FileBasedLanguageRepository();
export default languageRepository;