import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModule } from './LanguageModule'

import { withCache } from '../../orm.config';
import { WordModule } from './WordModule';

@Module({
    imports: [
        TypeOrmModule.forRoot(withCache),
        LanguageModule,
        WordModule
    ]    
})
export class AppModule {}