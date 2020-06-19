import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from './AbstractEntity';
import { PracticeList } from './PracticeList';
import { Word } from './Word';
import { Transform, Exclude } from 'class-transformer';
import { TranslationAttempt } from './TranslationAttempt';
import { TranslationDto } from '../adapter/http/dto/TranslationDto';

/**
 * A {@link Translation} maps one {@link Word} from one language into another {@link Word} from a different one.
 */
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

    @OneToMany(type => TranslationAttempt, translationAttempt => translationAttempt.translation, { eager: false }) 
    @Exclude()
    translationAttempts: TranslationAttempt[];

    getID(): number {
        return this.id;
    }    

    determineSource(sourceToTarget: boolean): string {
        if (sourceToTarget) {
            return this.source.value;
        } else {
            return this.target.value;
        }
    }

    determineCorrectAnswer(sourceToTarget: boolean): string {
        if (sourceToTarget) {
            return this.target.value;
        } else {
            return this.source.value;
        }
    }

    static from(sourceWord: Word, targetWord: Word, practiceList: PracticeList): Translation {
        let translation: Translation = new Translation();
        translation.source = sourceWord;
        translation.target = targetWord;
        translation.practiceList = practiceList;
        translation.translationAttempts = [];
        return translation;
    }
}