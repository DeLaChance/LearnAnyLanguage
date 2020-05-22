import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreatePracticeRunCommand } from '../../domain/commands/CreatePracticeRunCommand';
import { Inject } from '@nestjs/common';
import { PracticeRunService } from '../PracticeRunService';
import { PracticeRun } from '../../domain/PracticeRun';

@CommandHandler(CreatePracticeRunCommand)
export class CreatePracticeRunCommandHandler implements ICommandHandler<CreatePracticeRunCommand> {
    
    @Inject()
    practiceRunService: PracticeRunService;

    execute(command: CreatePracticeRunCommand): Promise<PracticeRun> {
        return this.practiceRunService.start(command);
    }
    
}