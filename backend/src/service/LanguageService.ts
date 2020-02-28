import { Language } from '../domain/Language';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService extends TypeOrmCrudService<Language> {

    constructor(@InjectRepository(Language) repo: Repository<Language>) {
        super(repo);
    }

}