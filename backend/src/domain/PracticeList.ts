import { Translation } from "./Translation";
import { Language } from "./Language";
import { Entity } from "./Entity";

export class PracticeList implements Entity<number> {

    private id: number;
    private translations: Translation[];
    private source: Language;
    private target: Language;

    constructor(id: number, translations: Translation[], source: Language, target: Language) {
        this.id = id;
        this.translations = translations;
        this.source = source;
        this.target = target;
    }

    getID(): number {
        return this.id;
    }

}