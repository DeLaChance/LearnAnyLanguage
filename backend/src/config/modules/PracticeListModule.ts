import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PracticeListController } from "../../adapter/http/PracticeListController";
import { Language } from "../../domain/Language";
import { PracticeList } from "../../domain/PracticeList";
import { PracticeRun } from "../../domain/PracticeRun";
import { Translation } from "../../domain/Translation";
import { TranslationAttempt } from "../../domain/TranslationAttempt";
import { Word } from "../../domain/Word";
import { CreatePracticeRunCommandHandler } from "../../service/commands/CreatePracticeRunCommandHandler";
import { PracticeListFileImporter } from "../../service/practicelist/PracticeListFileImporter";
import { PracticeListService } from "../../service/practicelist/PracticeListService";
import { PracticeRunService } from "../../service/PracticeRunService";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";

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
    WebSocketAdapter,
    ...commandHandlers, 
    ...eventHandlers
  ],
  exports: [
    PracticeListService,
    WebSocketAdapter
  ],
  controllers: [
    PracticeListController
  ]
})
export class PracticeListModule {
}