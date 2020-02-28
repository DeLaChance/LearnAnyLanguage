import { Optional } from "typescript-optional";
import { AbstractEntity } from "../domain/AbstractEntity";

export abstract class Repository<ID> {

    abstract findAll(): Promise<AbstractEntity<ID>[]>;
    abstract findById(id: ID): Promise<Optional<AbstractEntity<ID>>>;
    abstract save(entity: AbstractEntity<ID>): Promise<AbstractEntity<ID>>;
    abstract delete(id: ID): Promise<AbstractEntity<ID>>;
}
