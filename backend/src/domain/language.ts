
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { AbstractEntity } from './AbstractEntity'
import { Word } from "./Word";
import { Exclude, Expose } from "class-transformer";

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

