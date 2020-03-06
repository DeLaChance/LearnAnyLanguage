import { Language } from './Language';
import { AbstractEntity } from './AbstractEntity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class Word implements AbstractEntity<number> {

    @PrimaryGeneratedColumn()
    @Exclude()    
    id: number;

    @ManyToOne(type => Language, { nullable: false, eager: true })
    @JoinColumn({ name: 'languageIso2Code', referencedColumnName: 'iso2Code' })
    @Transform(language => language.iso2Code)
    language: Language;

    @Column()
    value: string;

    getID(): number {
        return this.id;
    }

}