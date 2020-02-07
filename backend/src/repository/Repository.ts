import { Optional } from "typescript-optional";

export abstract class Repository<T, ID> {

    abstract findAll(): Promise<T[]>;
    abstract findById(id: ID): Promise<Optional<T>>;
    abstract save(t: T): Promise<T>;
    abstract delete(id: ID): Promise<T>;
}
