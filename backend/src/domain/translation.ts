import { Word } from './Word';
import { AbstractEntity } from './AbstractEntity';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { PracticeList } from './PracticeList';

@Entity()
export class Translation implements AbstractEntity<number> {
    
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Word, { nullable: false })
    @JoinColumn()
    source: Word;

    @OneToOne(type => Word, { nullable: false })
    @JoinColumn()
    target: Word;
    
    @ManyToOne(type => PracticeList, practiceList => practiceList.translations)
    practiceList: PracticeList;

    getID(): number {
        return this.id;
    }    
}