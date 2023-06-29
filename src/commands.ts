import {encodeArray, encodeBulkString, encodeError, encodeSimpleString} from "./resp_encoder";
import {RESP_Data} from "./globals";
import {setData, getData} from "./datahandling";

abstract class Command {
    // infomation needed for the "COMMAND" command
    constructor(public name: string, // name of the command
                // public description: string, // description of the command (for COMMAND DOCS)
                public arity: number, // nummber of arguments (the name is the first at [0]), negativ means minimal amount
                public flags: string[],
                public firstKey: number, // where to find the first key (mostly 1)
                public lastKey: number, // where to find the last key, if there could be one, else same as firstKey
                public step: number) // "steps" between keys
    {
        this.name = name.toLowerCase()
    }

    public abstract exec(request: RESP_Data[] ): string
}

class PING extends Command {
    constructor() {
        super("ping", -1, [], 0, 0, 0);
    }

    exec(request: RESP_Data[]): string {
        if(request.length > 2) {
            return encodeError("To many arguments for PING")
        }
        if(request[1]) {
            return encodeSimpleString(String(request[1]))
        }
        return encodeSimpleString("PONG")
    }
}

class SET extends Command {
    constructor() {
        super("set", -3, [], 1, 1, 1);
    }

    exec(request: RESP_Data[]): string {
        if (request.length != -this.arity) {
            return encodeError("Wrong argument count for SET")
        }
        setData(String(request[1]), String(request[2]))
        return encodeSimpleString("OK");
    }
}

class GET extends Command {
    constructor() {
        super("get", -2, [], 1, 1, 1);
    }
    exec(request: RESP_Data[]): string {
        if (request.length != 2) {
            return encodeError("Wrong argument count for GET")
        }
        const key = getData(String(request[1]))
        return key ? encodeBulkString(String(key)) : encodeBulkString(null);
    }
}

class COMMAND extends Command {
    // https://redis.io/commands/command/
    constructor() {
        super("command", -1, [], 0, 0, 0);
    }

    public exec(request: RESP_Data[]): string {
        if(request.length == 1) {
            // return All Commands
            return encodeArray(this.getAllCommandDetails())
        } else if(String(request[1]).toUpperCase() === "INFO") {
            // return specific command
            if(request.length < 3) { return encodeError("No Command after INFO.") }
            try {
                const commandInfos: RESP_Data[] = []
                for(let i = 2; i < request.length; i++) {
                    commandInfos.push(this.getCommandDetails(String(request[i])))
                }
                return encodeArray(commandInfos)
            } catch (e) {
                return encodeError((e as Error).message)
            }
        }
        return encodeError("Wrong arguments")
    }

    private getAllCommandDetails(): RESP_Data[] {
        const commandDetails: RESP_Data[][] = []
        COMMANDS.forEach((command) =>{
            commandDetails.push(this.getCommandDetails(command.name))
        })

        return commandDetails
    }

    private getCommandDetails(commandName: string): RESP_Data[] {
        const command = COMMANDS.get(commandName.toUpperCase())
        if(command) {
            return [command.name, command.arity, command.flags, command.firstKey, command.lastKey, command.step]
        }
        throw new Error("Command " + commandName.toUpperCase() + " unknown.")
    }
}

export const COMMANDS: Map<string, Command> = new Map<string, Command>([
    ["PING", new PING()],
    ["SET",  new SET()],
    ["GET", new GET()],
    ["COMMAND", new COMMAND()]
]);