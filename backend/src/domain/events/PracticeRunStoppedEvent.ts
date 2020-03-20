import { Status } from "../PracticeRun";

export class PracticeRunStoppedEvent {

    runId: string;
    newState: Status;
}