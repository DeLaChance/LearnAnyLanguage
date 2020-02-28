import { Language } from './Language';
import { AbstractEntity } from './AbstractEntity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Word implements AbstractEntity<number> {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => Language, { nullable: false })
    @JoinColumn()
    language: Language;

    @Column()
    value: string;

    getID(): number {
        return this.id;
    }
}