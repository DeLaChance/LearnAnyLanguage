import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModule } from './LanguageModule'

import { withCache } from '../../orm.config';
import { WordModule } from './WordModule';
import { PracticeListModule } from './PracticeListModule';
import { MulterModule } from '@nestjs/platform-express';
import { PracticeRunModule } from './PracticeRunModule';

@Module({
    imports: [
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