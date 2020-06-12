import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PracticeRunController } from "../../adapter/http/PracticeRunController";
import { PracticeList } from "../../domain/PracticeList";
import { PracticeRun } from "../../domain/PracticeRun";
import { TranslationAttempt } from "../../domain/TranslationAttempt";
import { PracticeRunAnswerGivenEventHandler } from "../../service/events/PracticeRunAnswerGivenEventHandler";
import { PracticeRunAnswerTimedOutEventHandler } from "../../service/events/PracticeRunAnswerTimedOutEventHandler";
import { PracticeRunCreatedEventHandler } from "../../service/events/PracticeRunCreatedEventHandler";
import { PracticeRunService } from "../../service/PracticeRunService";
import { PracticeRunPausedEventHandler } from "../../service/events/PracticeRunPausedEventHandler";
import { PracticeRunStoppedEventHandler } from "../../service/events/PracticeRunStoppedEventHandler";
import { PracticeRunRestartedEventHandler } from "../../service/events/PracticeRunRestartedEventHandler";
import { WebSocketAdapter } from "../../adapter/websocket/WebSocketAdapter";
import { PracticeRunAnswerCreatedEventHandler } from "../../service/events/PracticeRunAnswerCreatedEventHandler";

export const commandHandlers = [ ];
export const eventHandlers = [ 
  PracticeRunAnswerCreatedEventHandler,
  PracticeRunAnswerGivenEventHandler, 
  PracticeRunAnswerTimedOutEventHandler,
  PracticeRunCreatedEventHandler,
  PracticeRunStoppedEventHandler,
  PracticeRunPausedEventHandler,
  PracticeRunRestartedEventHandler
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PracticeRun, PracticeList, TranslationAttempt])
  ],
  providers: [
    PracticeRunService,
    WebSocketAdapter,
    ...commandHandlers,
    ...eventHandlers
  ],
  exports: [
    PracticeRunService,
    WebSocketAdapter
  ],
  controllers: [
    PracticeRunController
  ]
})
export class PracticeRunModule {
}