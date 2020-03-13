import { Language } from './Language';
import { AbstractEntity } from './AbstractEntity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

/**
 * A word is a sequence of characters bound to a particular {@link Language}.
 */
@Entity()
export class Word implements AbstractEntity<number> {

    @PrimaryGeneratedColumn()
    @Exclude()    
    id: number;

    @ManyToOne(type => Language, { nullable: false })
    @JoinColumn({ name: 'languageIso2Code', referencedColumnName: 'iso2Code' })
    @Transform(language => language.iso2Code)
    language: Language;

    @Column()
    value: string;

    getID(): number {
        return this.id;
    }

}