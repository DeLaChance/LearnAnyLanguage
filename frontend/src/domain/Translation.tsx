export class Translation {

    id: number;
    source: string;
    word: string;

    constructor(id: number, source: string, word: string) {
        this.id = id;
        this.source = source;
        this.word = word;
    }

    static from(translationJson: any): Translation {
        return new Translation(translationJson.id, translationJson.source, translationJson.word);
    }
}