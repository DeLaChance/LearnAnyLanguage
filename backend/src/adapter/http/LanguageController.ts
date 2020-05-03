import { Controller, ClassSerializerInterceptor, UseInterceptors } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";

import { Language } from "../../domain/Language";
import { LanguageService } from "../../service/LanguageService";
import { HttpResponseInterceptor } from "./HttpResponseInterceptor";

@Crud({
  model: {
    type: Language
  }
})
@Controller("/api/languages")
@UseInterceptors(ClassSerializerInterceptor, HttpResponseInterceptor)
export class LanguageController implements CrudController<Language> {

  constructor(public service: LanguageService) {      
  }
  
}