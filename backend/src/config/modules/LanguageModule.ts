import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Language } from "../../domain/Language";
import { LanguageService } from "../../service/LanguageService";
import { LanguageController } from "../../adapter/http/LanguageController";

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguageService],
  exports: [LanguageService],
  controllers: [LanguageController]
})
export class LanguageModule {}