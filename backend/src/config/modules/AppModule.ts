import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageModule } from './LanguageModule'

import { withCache } from '../../orm.config';

@Module({
    imports: [
        TypeOrmModule.forRoot(withCache),
        LanguageModule
    ],
    providers: [
        
    ]
})
export class AppModule {}