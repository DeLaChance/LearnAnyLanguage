export class PracticeList {

    id: string;
    name: string;
    source: string; 
    target: string;

    constructor(id: string, name: string, source: string, target: string) {
        this.id = id;
        this.name = name;
        this.source = source;
        this.target = target;
    }

}