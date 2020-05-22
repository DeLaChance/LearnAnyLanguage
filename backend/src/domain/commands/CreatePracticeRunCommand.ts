import { PracticeRunConfiguration } from "../../adapter/http/dto/PracticeRunConfiguration";

export class CreatePracticeRunCommand {
    
    listId: string;
    configuration: PracticeRunConfiguration;
}