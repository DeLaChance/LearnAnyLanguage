import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PracticeListController } from "../../adapter/http/PracticeListController";
import { PracticeList } from "../../domain/PracticeList";
import { PracticeListService } from "../../service/practicelist/PracticeListService";
import { PracticeListFileImporter } from "../../service/practicelist/PracticeListFileImporter";
import { Translation } from "../../domain/Translation";
import { Word } from "../../domain/Word";
import { Language } from "../../domain/Language";
import { PracticeRunService } from "../../service/PracticeRunService";
import { PracticeRun } from "../../domain/PracticeRun";
import { TranslationAttempt } from "../../domain/TranslationAttempt";
import { CqrsModule } from "@nestjs/cqrs";
import { CreatePracticeRunCommandHandler } from "../../service/commands/CreatePracticeRunCommandHandler";
import { PracticeRunAnswerGivenEventHandler } from "../../service/events/PracticeRunAnswerGivenEventHandler";
import { PracticeRunAnswerTimedOutEventHandler } from "../../service/events/PracticeRunAnswerTimedOutEventHandler";
import { PracticeRunCreatedEventHandler } from "../../service/events/PracticeRunCreatedEventHandler";

export const commandHandlers = [ CreatePracticeRunCommandHandler ];
export const eventHandlers = [];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      PracticeList, 
      Language, 
      Word, 
      Translation, 
      PracticeRun, 
      TranslationAttempt
    ])    
  ],
  providers: [
    PracticeListService, 
    PracticeListFileImporter, 
    PracticeRunService, 
    ...commandHandlers, 
    ...eventHandlers
  ],
  exports: [
    PracticeListService
  ],
  controllers: [
    PracticeListController
  ]
})
export class PracticeListModule {
}