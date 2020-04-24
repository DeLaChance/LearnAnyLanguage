import { Translation } from './Translation';

export class PracticeList {

    id: string;
    name: string;
    source: string; 
    target: string;
    translations: Translation[];

    constructor(id: string, name: string, source: string, target: string, translations: Translation[]) {
        this.id = id;
        this.name = name;
        this.source = source;
        this.target = target;
        this.translations = translations;
    }

    static from(responseJson: any): PracticeList {        
        let translations: Translation[] = responseJson.translations.map((translationJson: any) => 
            Translation.from(translationJson));
        return new PracticeList(responseJson.id, responseJson.name, responseJson.source, 
            responseJson.target, translations);
    }

}