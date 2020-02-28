import { Controller } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";

import { Language } from "../../domain/Language";
import { LanguageService } from "../../service/LanguageService";

@Crud({
  model: {
    type: Language
  }
})
@Controller("/api/languages")
export class LanguageController implements CrudController<Language> {

  constructor(public service: LanguageService) {      
  }
  
}