export class Translation {

    id: number;
    source: string;
    target: string;

    constructor(id: number, source: string, target: string) {
        this.id = id;
        this.source = source;
        this.target = target;
    }

    static from(translationJson: any): Translation {
        return new Translation(translationJson.id, translationJson.source, translationJson.target);
    }
}