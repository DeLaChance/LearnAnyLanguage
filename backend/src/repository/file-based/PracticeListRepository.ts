import config from '../../config/config.json';
import { FileBasedRepository } from '../FileBasedRepository';
import { PracticeList } from '../../domain/PracticeList';

class PracticeListRepository extends FileBasedRepository<string> {

    constructor() {
        super(config.repos.practicelists.location, PracticeList, "FileBasedPracticeListRepository");
    }

}

const practiceListRepository = new PracticeListRepository();
export default practiceListRepository;