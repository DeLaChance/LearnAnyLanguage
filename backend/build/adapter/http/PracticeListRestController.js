"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
/*
router.get("/", (req, res) => findAll(res));
router.get("/:id", (req, res) => findById(req, res));
router.delete("/:id", (req,res) => deleteById(req, res));

function findAll(res: Response): void {
    practiceListRepository.findAll()
        .then(practiceLists => {
            let body: string = serialize(practiceLists);
            res.status(200).setHeader('Content-Type', "application/json");
            res.send(body);
        })
        .catch(reason => res.status(500).send(reason));
}

function findById(req: Request, res: Response) {
    practiceListRepository.findById(req.body.id)
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

function deleteById(req: Request, res: Response) {
    practiceListRepository.delete(req.body.id)
        .then(practiceList => {
            let body: string = serialize(practiceList);
            res.status(200).setHeader('Content-Type', "application/json");
            res.send(body);
        })
        .catch(reason => res.status(500).send(reason));
}
*/ 
