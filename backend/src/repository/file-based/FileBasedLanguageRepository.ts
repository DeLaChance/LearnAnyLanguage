import config from '../../config/config.json';
import { Language } from '../../domain/Language';
import { FileBasedRepository } from '../FileBasedRepository';

class FileBasedLanguageRepository extends FileBasedRepository<string> {

    constructor() {
        super(config.repos.language.location, Language, "FileBasedLanguageRepository");
    }

}

const languageRepository = new FileBasedLanguageRepository();
export default languageRepository;