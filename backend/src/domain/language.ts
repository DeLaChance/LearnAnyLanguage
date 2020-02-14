import { Entity } from "./Entity";

export class Language implements Entity<string> {

    iso2Code: string;
    name: string;

    constructor(iso2Code: string, name: string) {
        this.iso2Code = iso2Code;
        this.name = name;
    }

    getID(): string {
        return this.iso2Code;
    }
}

