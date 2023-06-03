import {encodeError, encodeSimpleString} from "./resp_encoder";
import {RESP_Data} from "./globals";
abstract class Command {
    abstract exec(request): string
}

class PING extends Command {
    exec(request: RESP_Data[]): string {
        if(request.length > 2) {
            return encodeError("To many arguments for PONG")
        }
        if(request[1]) {
            return encodeSimpleString(String(request[1]))
        }
        return encodeError("PONG")
    }
}

export const COMMANDS = new Map<string, Command>([
    ["PING", new PING()],
]);