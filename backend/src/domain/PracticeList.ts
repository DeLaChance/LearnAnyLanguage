import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import { Language } from "./Language";
import { Translation } from "./Translation";
import { Transform, Expose } from "class-transformer";

@Entity()
export class PracticeList implements AbstractEntity<string> {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @Index({ unique: true })
    name: string;

    @OneToMany(type => Translation, translation => translation.practiceList, { eager: true })
    translations: Translation[];
    
    @JoinColumn()
    @ManyToOne(type => Language, { nullable: false })
    @Transform(language => language.iso2Code)
    source: Language;

    @JoinColumn()
    @ManyToOne(type => Language, { nullable: false })
    @Transform(language => language.iso2Code)
    target: Language;

    getID(): string {
        return this.id;
    }

}