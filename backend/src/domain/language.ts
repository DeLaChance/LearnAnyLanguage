
import { Column, Entity, PrimaryColumn } from "typeorm";
import { AbstractEntity } from './AbstractEntity';

/**
 *  The method of human communication, either spoken or written, consisting of the use of {@link Word}'s' in a 
 *  structured and conventional way.
 */
@Entity()
export class Language implements AbstractEntity<string> {

    @PrimaryColumn()
    iso2Code: string;

    @Column({
        length: 256
    })
    name: string;

    @Column({
        length: 512,
        nullable: true
    })
    wikipediaDescriptionLink: string;

    @Column({
        length: 512,
        nullable: true
    })
    learnMoreWikipediaLink: string;

    getID(): string {
        return this.iso2Code;
    }
}

