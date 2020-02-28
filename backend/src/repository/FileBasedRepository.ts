import { deserializeArray, serialize } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";
import fs from 'fs-extra';
import { Optional } from "typescript-optional/dist/optional";
import { AbstractEntity } from "../domain/AbstractEntity";
import { Repository } from "./Repository";
import { factory } from "../config/ConfigLog4j";

export abstract class FileBasedRepository<ID> extends Repository<ID> {

    private log = factory.getLogger("FileBasedRepository");

    private location: string;
    private name: string;
    private inMemoryCache: Map<ID, AbstractEntity<ID>>;
    private readingCache: Boolean;
    private classType: ClassType<AbstractEntity<ID>>;
    
    constructor(location: string, classType: ClassType<AbstractEntity<ID>>, name: string) {
        super();
        this.location = location;
        this.name = name;
        this.inMemoryCache = new Map();
        this.readingCache = true;
        this.classType = classType;

        this.initializeRepo();
    }   

    findAll(): Promise<AbstractEntity<ID>[]> {
        if (this.readingCache) {
            return Promise.reject(this.name + " is still loading cache.");
        } else {
            return Promise.resolve(Array.from(this.inMemoryCache.values()));
        }
    }

    findById(id: ID): Promise<Optional<AbstractEntity<ID>>> {
        if (this.readingCache) {
            return Promise.reject(this.name + " is still loading cache.");
        } else {
            return Promise.resolve(this.tryFindById(id));
        }        
    }

    save(entity: AbstractEntity<ID>): Promise<AbstractEntity<ID>> {
        if (this.readingCache) {
            return Promise.reject(this.name + " is still loading cache.");
        } else {
            this.inMemoryCache.set(entity.getID(), entity);
            return this.flushCache()
                .then(() => Promise.resolve(entity));
        }
    }

    delete(id: ID): Promise<AbstractEntity<ID>> {

        let promise: Promise<AbstractEntity<ID>>;
        if (this.readingCache) {
            promise = Promise.reject(this.name + " is still loading cache.");
        } else {
            let optional: Optional<AbstractEntity<ID>> = this.tryFindById(id);
            if (optional.isPresent()) {
                this.inMemoryCache.delete(id);
                promise = this.flushCache()
                    .then(() => Promise.resolve(optional.get()));
            } else {
                promise = Promise.reject("Not found");
            }             
        }     
        
        return promise;
    }

    protected tryFindById(id: ID): Optional<AbstractEntity<ID>> {
        return Optional.ofNullable(this.inMemoryCache.get(id));
    }    

    private initializeRepo(): void {
        this.ensureRepoExists()
            .then(() => this.readRepoFile())
            .then(fileContents => this.fillCache(fileContents))
            .then(() => this.log.info(() => `${this.name} initialized under directory ${this.location}`))
            .catch(reason => this.log.error(() => `${this.name} not initialized due to: ${reason}`));           
    }

    private ensureRepoExists(): Promise<void> {
        return fs.ensureFile(this.location);
    }

    private readRepoFile(): Promise<string> {
        return fs.readFile(this.location, "UTF-8");
    }

    private fillCache(fileContents: string): Promise<void> {
        let entities: AbstractEntity<ID>[] = deserializeArray(this.classType, fileContents);
        entities.forEach(entity => this.inMemoryCache.set(entity.getID(), entity));
        this.readingCache = false;
        return Promise.resolve();
    }

    private flushCache(): Promise<void> {
        let fileContents: string = serialize(Array.from(this.inMemoryCache.values()));
        this.readingCache = true;
        return fs.writeFile(this.location, fileContents);            
    }    
}