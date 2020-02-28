
import { Entity, Column, PrimaryColumn } from "typeorm";
import { AbstractEntity } from './AbstractEntity'

@Entity()
export class Language implements AbstractEntity<string> {

    @PrimaryColumn()
    iso2Code: string;

    @Column({
        length: 256
    })
    name: string;

    getID(): string {
        return this.iso2Code;
    }
}

