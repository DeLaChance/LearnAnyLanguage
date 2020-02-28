import { Language } from '../../domain/Language';
import { Repository } from '../Repository.js';
import { Optional } from "typescript-optional";
import { Entity } from "../../domain/Entity";

class PostgresLanguageRepository extends Repository<string> {

    constructor() {
        super();
    }    

    findAll(): Promise<Entity<string>[]> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<Optional<Entity<string>>> {
        throw new Error("Method not implemented.");
    }

    save(entity: Entity<string>): Promise<Entity<string>> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<Entity<string>> {
        throw new Error("Method not implemented.");
    }
    
}

const postgresLanguageRepository = new PostgresLanguageRepository();
export default postgresLanguageRepository;