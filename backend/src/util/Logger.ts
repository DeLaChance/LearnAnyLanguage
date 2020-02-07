export class Logger {

    static log(message: string, ...params: any) {
        console.log(message, params);
    }

    static error(message: string, ...params: any) {
        console.error(message, params);
    }
}