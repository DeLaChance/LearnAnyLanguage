import { Word } from '../domain/Word';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from 'typeorm';

@Injectable()
export class WordService extends TypeOrmCrudService<Word> {

    constructor(@InjectRepository(Word) repo: Repository<Word>) {
        super(repo);
    }

}