import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { withCache } from '../../orm.config';
import { LanguageModule } from './LanguageModule';
import { PracticeListModule } from './PracticeListModule';
import { PracticeRunModule } from './PracticeRunModule';
import { WordModule } from './WordModule';


@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forRoot(withCache),
        LanguageModule,
        WordModule,
        PracticeListModule,
        PracticeRunModule,
        MulterModule.register({
            dest: './tmp/' 
        })
    ]   
})
export class AppModule {}