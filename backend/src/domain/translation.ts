import { Word } from './Word';
import { Entity } from './Entity';

export class Translation implements Entity<number> {
    
    private id: number;
    private source: Word;
    private target: Word;

    constructor(id: number, source: Word, target: Word) {
        this.id = id;
        this.source = source;
        this.target = target;
    }

    getID(): number {
        return this.id;
    }    
}