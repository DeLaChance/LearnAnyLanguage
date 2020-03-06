import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { PracticeList } from './PracticeList';
import { Word } from './Word';
import { Transform, Exclude } from 'class-transformer';

@Entity()
export class Translation implements AbstractEntity<number> {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Word, { nullable: false, eager: true })
    @JoinColumn()
    @Transform(word => word.value)
    source: Word;

    @ManyToOne(type => Word, { nullable: false, eager: true })
    @JoinColumn()
    @Transform(word => word.value)
    target: Word;
    
    @ManyToOne(type => PracticeList, practiceList => practiceList.translations)
    @Exclude()
    practiceList: PracticeList;

    getID(): number {
        return this.id;
    }    
}