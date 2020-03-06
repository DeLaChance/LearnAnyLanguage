import { Controller, UseInterceptors, ClassSerializerInterceptor, Get } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";

import { WordService } from "../../service/WordService";
import { Word } from "../../domain/Word";

@Crud({
  model: {
    type: Word    
  }
})
@Controller("/api/words")
@UseInterceptors(ClassSerializerInterceptor)
export class WordController implements CrudController<Word> {

  constructor(public service: WordService) {      
  }

  @Get()
  findAll() {
    return this.service.find();
  }
  
}