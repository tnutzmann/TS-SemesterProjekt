import {encodeBulkString, encodeError, encodeSimpleString} from "./resp_encoder";
import {RESP_Data} from "./globals";
import {setData, getData} from "./datahandling";

abstract class Command {
    abstract exec(request: RESP_Data[] ): string
}

class PING extends Command {
    exec(request: RESP_Data[]): string {
        if(request.length > 2) {
            return encodeError("To many arguments for PONG")
        }
        if(request[1]) {
            return encodeSimpleString(String(request[1]))
        }
        return encodeSimpleString("PONG")
    }
}

class SET extends Command {
    exec(request: RESP_Data[]): string {
        if (request.length != 3) {
            return encodeError("Wrong argument count for SET")
        }
        setData(String(request[1]), String(request[2]))
        return encodeSimpleString("OK");
    }
}

class GET extends Command {
    exec(request: RESP_Data[]): string {
        if (request.length != 2) {
            return encodeError("Wrong argument count for GET")
        }
        const key = getData(String(request[1]))
        return key ? encodeBulkString(String(key)) : encodeBulkString(null);
    }
}

export const COMMANDS: Map<string, Command> = new Map<string, Command>([
    ["PING", new PING()],
    ["SET",  new SET()],
    ["GET", new GET()]
]);