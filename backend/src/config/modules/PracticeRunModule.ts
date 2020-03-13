import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PracticeRunController } from "../../adapter/http/PracticeRunController";
import { PracticeRun } from "../../domain/PracticeRun";
import { PracticeRunService } from "../../service/PracticeRunService";
import { PracticeList } from "../../domain/PracticeList";
import { TranslationAttempt } from "../../domain/TranslationAttempt";

@Module({
  imports: [TypeOrmModule.forFeature([PracticeRun, PracticeList, TranslationAttempt])],
  providers: [PracticeRunService],
  exports: [PracticeRunService],
  controllers: [PracticeRunController]
})
export class PracticeRunModule {
}