import { Optional } from "typescript-optional";
import { Entity } from "../domain/Entity";

export abstract class Repository<ID> {

    abstract findAll(): Promise<Entity<ID>[]>;
    abstract findById(id: ID): Promise<Optional<Entity<ID>>>;
    abstract save(entity: Entity<ID>): Promise<Entity<ID>>;
    abstract delete(id: ID): Promise<Entity<ID>>;
}
