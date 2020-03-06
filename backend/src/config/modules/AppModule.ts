import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModule } from './LanguageModule'

import { withCache } from '../../orm.config';
import { WordModule } from './WordModule';
import { PracticeListModule } from './PracticeListModule';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forRoot(withCache),
        LanguageModule,
        WordModule,
        PracticeListModule,
        MulterModule.register({
            dest: './tmp/' 
        })
    ]    
})
export class AppModule {}