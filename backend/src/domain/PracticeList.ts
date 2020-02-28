import { Translation } from "./Translation";
import { Language } from "./Language";
import { AbstractEntity } from "./AbstractEntity";
import { PrimaryGeneratedColumn, Entity, OneToMany, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class PracticeList implements AbstractEntity<number> {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Translation, translation => translation.practiceList)
    translations: Translation[];
    
    @JoinColumn()
    @OneToOne(type => Language, { nullable: false })
    source: Language;

    @JoinColumn()
    @OneToOne(type => Language, { nullable: false })
    target: Language;

    getID(): number {
        return this.id;
    }

}