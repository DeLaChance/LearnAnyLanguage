import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Word } from "../../domain/Word";
import { WordService } from "../../service/WordService";
import { WordController } from "../../adapter/http/WordController";

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  providers: [WordService],
  exports: [WordService],
  controllers: [WordController]
})
export class WordModule {}