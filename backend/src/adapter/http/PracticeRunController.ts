import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Param, Post, UseInterceptors } from "@nestjs/common";
import { Crud, CrudController } from "@nestjsx/crud";
import { PracticeRun } from "../../domain/PracticeRun";
import { TranslationAttempt } from "../../domain/TranslationAttempt";
import { PracticeRunService } from "../../service/PracticeRunService";
import { AnswerDto } from "./dto/AnswerDto";

@Crud({
    model: {
      type: PracticeRun    
    }
  })
  @Controller("/api/runs/")
  @UseInterceptors(ClassSerializerInterceptor)
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

    @Post(":runId/giveAnswer")
    giveAnswer(@Param("runId") runId: string, @Body() answerDto: AnswerDto): Promise<TranslationAttempt> {
        return this.service.giveAnswer(runId, answerDto.answer);
    }    
  }