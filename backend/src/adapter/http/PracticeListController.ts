import { ClassSerializerInterceptor, Controller, Get, UseInterceptors, Post, UploadedFile, Inject, Param, Body } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { PracticeList } from "../../domain/PracticeList";
import { PracticeListService } from "../../service/practicelist/PracticeListService";
import { PracticeListFileImporter } from "../../service/practicelist/PracticeListFileImporter";
import { diskStorage } from  'multer';
import { extname } from  'path';
import { v4 as uuidv4 } from "uuid";
import { FileInterceptor } from "@nestjs/platform-express";
import { PracticeRunService } from "../../service/PracticeRunService";
import { PracticeRun } from "../../domain/PracticeRun";
import { CommandBus } from "@nestjs/cqrs";
import { CreatePracticeRunCommand } from "../../domain/commands/CreatePracticeRunCommand";
import { TranslationDto } from "./dto/TranslationDto";

@Crud({
  model: {
    type: PracticeList    
  }
})
@Controller("/api/lists/")
@UseInterceptors(ClassSerializerInterceptor)
export class PracticeListController implements CrudController<PracticeList> {

    @Inject()
    service: PracticeListService;

    @Inject()
    practiceRunService: PracticeRunService;

    @Inject()
    importer: PracticeListFileImporter;

    @Inject()
    commandBus: CommandBus;

    @Get()
    findAll() {
        return this.service.find();
    }

    @Get(":listId")
    findById(@Param("listId") listId: string) {
        return this.service.findOne(listId);
    }

    @Post("create")
    @UseInterceptors(FileInterceptor('file', 
        {
            storage: diskStorage({
                  destination: './tmp/', 
                  filename: (req, file, cb) => {
                      const randomName = uuidv4();
                      return cb(null, `${randomName}${extname(file.originalname)}`)
                  }
              })
        }    
    ))
    async uploadFile(@UploadedFile() uploadedFile: Express.Multer.File): Promise<PracticeList> {
        return this.importer.importFile(uploadedFile.path);          
    }
    
    @Post(":listId/start")
    startPracticeRun(@Param("listId") listId: string): Promise<PracticeRun> {
        let command: CreatePracticeRunCommand = new CreatePracticeRunCommand();
        command.listId = listId;

        return this.commandBus.execute(command);
    }

    @Post(":listId/add")
    addTranslation(@Param("listId") listId: string, @Body() translationDto: TranslationDto): Promise<PracticeList> {
        return this.service.addTranslation(listId, translationDto);
    }
}