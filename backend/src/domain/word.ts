import { Language } from './Language';
import { Entity } from './Entity';

export class Word implements Entity<number> {

    private id: number;
    private language: Language;
    private value: string;

    constructor(id: number, language: Language, value: string) {
        this.id = id;
        this.language = language;
        this.value = value;
    }

    getID(): number {
        return this.id;
    }
}