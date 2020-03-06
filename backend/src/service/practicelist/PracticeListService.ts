import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from 'typeorm';
import { PracticeList } from "../../domain/PracticeList";

@Injectable()
export class PracticeListService extends TypeOrmCrudService<PracticeList> {

    constructor(@InjectRepository(PracticeList) repo: Repository<PracticeList>) {
        super(repo);
    }

}