import { ClassSerializerInterceptor, Controller, Get, UseInterceptors, Post, UploadedFile, Inject, Param } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { PracticeList } from "../../domain/PracticeList";
import { PracticeListService } from "../../service/practicelist/PracticeListService";
import { PracticeListFileImporter } from "../../service/practicelist/PracticeListFileImporter";
import { diskStorage } from  'multer';
import { extname } from  'path';
import { v4 as uuidv4 } from "uuid";
import { FileInterceptor } from "@nestjs/platform-express";

@Crud({
  model: {
    type: PracticeList    
  }
})
@Controller("/api/lists/")
@UseInterceptors(ClassSerializerInterceptor)
export class PracticeListController implements CrudController<PracticeList> {

    @Inject()
    public service: PracticeListService;

    @Inject()
    private importer: PracticeListFileImporter;

    @Get()
    findAll() {
        return this.service.find();
    }

    @Get(":listId")
    findById(@Param("listId") listId: string) {
        return this.service.findOne(listId);
    }

    @Post('uploadFile')
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
}