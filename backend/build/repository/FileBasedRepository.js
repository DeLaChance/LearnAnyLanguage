"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var fs_extra_1 = __importDefault(require("fs-extra"));
var optional_1 = require("typescript-optional/dist/optional");
var Repository_1 = require("./Repository");
var ConfigLog4j_1 = require("../config/ConfigLog4j");
var FileBasedRepository = /** @class */ (function (_super) {
    __extends(FileBasedRepository, _super);
    function FileBasedRepository(location, classType, name) {
        var _this = _super.call(this) || this;
        _this.log = ConfigLog4j_1.factory.getLogger("FileBasedRepository");
        _this.location = location;
        _this.name = name;
        _this.inMemoryCache = new Map();
        _this.readingCache = true;
        _this.classType = classType;
        _this.initializeRepo();
        return _this;
    }
    FileBasedRepository.prototype.findAll = function () {
        if (this.readingCache) {
            return Promise.reject(this.name + " is still loading cache.");
        }
        else {
            return Promise.resolve(Array.from(this.inMemoryCache.values()));
        }
    };
    FileBasedRepository.prototype.findById = function (id) {
        if (this.readingCache) {
            return Promise.reject(this.name + " is still loading cache.");
        }
        else {
            return Promise.resolve(this.tryFindById(id));
        }
    };
    FileBasedRepository.prototype.save = function (entity) {
        if (this.readingCache) {
            return Promise.reject(this.name + " is still loading cache.");
        }
        else {
            this.inMemoryCache.set(entity.getID(), entity);
            return this.flushCache()
                .then(function () { return Promise.resolve(entity); });
        }
    };
    FileBasedRepository.prototype.delete = function (id) {
        var promise;
        if (this.readingCache) {
            promise = Promise.reject(this.name + " is still loading cache.");
        }
        else {
            var optional_2 = this.tryFindById(id);
            if (optional_2.isPresent()) {
                this.inMemoryCache.delete(id);
                promise = this.flushCache()
                    .then(function () { return Promise.resolve(optional_2.get()); });
            }
            else {
                promise = Promise.reject("Not found");
            }
        }
        return promise;
    };
    FileBasedRepository.prototype.tryFindById = function (id) {
        return optional_1.Optional.ofNullable(this.inMemoryCache.get(id));
    };
    FileBasedRepository.prototype.initializeRepo = function () {
        var _this = this;
        this.ensureRepoExists()
            .then(function () { return _this.readRepoFile(); })
            .then(function (fileContents) { return _this.fillCache(fileContents); })
            .then(function () { return _this.log.info(function () { return _this.name + " initialized under directory " + _this.location; }); })
            .catch(function (reason) { return _this.log.error(function () { return _this.name + " not initialized due to: " + reason; }); });
    };
    FileBasedRepository.prototype.ensureRepoExists = function () {
        return fs_extra_1.default.ensureFile(this.location);
    };
    FileBasedRepository.prototype.readRepoFile = function () {
        return fs_extra_1.default.readFile(this.location, "UTF-8");
    };
    FileBasedRepository.prototype.fillCache = function (fileContents) {
        var _this = this;
        var entities = class_transformer_1.deserializeArray(this.classType, fileContents);
        entities.forEach(function (entity) { return _this.inMemoryCache.set(entity.getID(), entity); });
        this.readingCache = false;
        return Promise.resolve();
    };
    FileBasedRepository.prototype.flushCache = function () {
        var fileContents = class_transformer_1.serialize(Array.from(this.inMemoryCache.values()));
        this.readingCache = true;
        return fs_extra_1.default.writeFile(this.location, fileContents);
    };
    return FileBasedRepository;
}(Repository_1.Repository));
exports.FileBasedRepository = FileBasedRepository;
