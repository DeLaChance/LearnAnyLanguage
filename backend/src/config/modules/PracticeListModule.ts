import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PracticeListController } from "../../adapter/http/PracticeListController";
import { PracticeList } from "../../domain/PracticeList";
import { PracticeListService } from "../../service/practicelist/PracticeListService";
import { PracticeListFileImporter } from "../../service/practicelist/PracticeListFileImporter";
import { Translation } from "../../domain/Translation";
import { Word } from "../../domain/Word";
import { Language } from "../../domain/Language";

@Module({
  imports: [TypeOrmModule.forFeature([PracticeList, Language, Word, Translation])],
  providers: [PracticeListService, PracticeListFileImporter],
  exports: [PracticeListService],
  controllers: [PracticeListController]
})
export class PracticeListModule {}