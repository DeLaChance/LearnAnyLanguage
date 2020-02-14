import languageRepository from '../../repository/file-based/FileBasedLanguageRepository';
import express, { Router, Response, Request } from 'express';
import { serialize } from "class-transformer";

let router: Router = express.Router();

router.get("/", (req, res) => findAllLanguages(res));
router.get("/:iso2Code", (req, res) => findLanguageByIsoCode(req, res));
router.put("/", (req, res) => createOrUpdateLanguage(req, res));
router.delete("/:iso2Code", (req,res) => deleteLanguage(req, res));

function findAllLanguages(res: Response): void {
    languageRepository.findAll()
        .then(languages => {
            let body: string = serialize(languages);
            res.status(200).setHeader('Content-Type', "application/json");
            res.send(body);
        })
        .catch(reason => res.status(500).send(reason));
}

function findLanguageByIsoCode(req: Request, res: Response): void {
    languageRepository.findById(req.params.iso2Code)
        .then(optional => {
            if (optional.isPresent()) {
                let body: string = serialize(optional.get());
                res.status(200).setHeader('Content-Type', "application/json");
                res.send(body)
            } else {
                res.status(404)
                    .send("No language with iso2Code '" + req.params.iso2Code + "'");
            }
        })
        .catch(reason => res.status(500).send(reason));    
}

function createOrUpdateLanguage(req: Request, res: Response): void {
    languageRepository.save(req.body)        
        .then(language => {
            let body: string = serialize(language);
            res.status(200).setHeader('Content-Type', "application/json");
            res.send(body);
        })
        .catch(reason => res.status(500).send(reason));    
}

function deleteLanguage(req: Request, res: Response): void {
    languageRepository.delete(req.params.iso2Code)
        .then(language => {
            let body: string = serialize(language);
            res.status(200).setHeader('Content-Type', "application/json");
            res.end(body);
        })
        .catch(reason => res.status(500).send(reason));    
}

export default router;