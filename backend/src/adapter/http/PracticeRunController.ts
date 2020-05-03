import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Param, Put, UseInterceptors, Header } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { PracticeRun } from "../../domain/PracticeRun";
import { TranslationAttempt } from "../../domain/TranslationAttempt";
import { PracticeRunService } from "../../service/PracticeRunService";
import { AnswerDto } from "./dto/AnswerDto";
import { HttpResponseInterceptor } from "./HttpResponseInterceptor";

@Crud({
    model: {
      type: PracticeRun    
    }
  })
  @Controller("/api/runs/")
  @UseInterceptors(ClassSerializerInterceptor, HttpResponseInterceptor)
  export class PracticeRunController implements CrudController<PracticeRun> {
    
    @Inject()
    service: PracticeRunService;
    
    @Get()
    findAll() {
        return this.service.find();
    }

    @Get(":runId")
    findById(@Param("runId") runId: string) {
        return this.service.findOne(runId);
    }

    @Put(":runId/giveAnswer")
    @Header('Content-Type', 'application/json')
    giveAnswer(@Param("runId") runId: string, @Body() answerDto: AnswerDto): Promise<TranslationAttempt> {
        return this.service.giveAnswer(runId, answerDto.answer);
    }    

    @Put(":runId/pause")
    pause(@Param("runId") runId: string): Promise<PracticeRun> {
      return this.service.pause(runId);
    }    

    @Put(":runId/abort")
    abort(@Param("runId") runId: string): Promise<PracticeRun> {
      return this.service.abort(runId);
    }        

    @Put(":runId/restart")
    restart(@Param("runId") runId: string): Promise<PracticeRun> {
      return this.service.restart(runId);
    }        

  }