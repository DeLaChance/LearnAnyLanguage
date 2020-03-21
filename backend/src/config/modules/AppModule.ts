import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { withCache } from '../../orm.config';
import { LanguageModule } from './LanguageModule';
import { PracticeListModule } from './PracticeListModule';
import { PracticeRunModule } from './PracticeRunModule';
import { WordModule } from './WordModule';
import { ScheduleModule } from '@nestjs/schedule'
import { WebSocketAdapter } from '../../adapter/websocket/WebSocketAdapter';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        CqrsModule,
        TypeOrmModule.forRoot(withCache),
        LanguageModule,
        WordModule,
        PracticeListModule,
        PracticeRunModule,
        MulterModule.register({
            dest: './tmp/' 
        })
    ],
    providers: [
        WebSocketAdapter
    ]   
})
export class AppModule {}