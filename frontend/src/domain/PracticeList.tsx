import { Translation } from './Translation';

export class PracticeList {

    id: string;
    name: string;
    source: string; 
    target: string;
    translations: Translation[];
    runsCount: number;

    constructor(id: string, name: string, source: string, target: string, translations: Translation[],
        runsCount: number) {

        this.id = id;
        this.name = name;
        this.source = source;
        this.target = target;
        this.translations = translations;
        this.runsCount = runsCount;
    }

    static from(responseJson: any): PracticeList {        
        let translations: Translation[] = responseJson.translations.map((translationJson: any) => 
            Translation.from(translationJson));
        return new PracticeList(responseJson.id, responseJson.name, responseJson.source, 
            responseJson.target, translations, responseJson.runsCount);
    }

}