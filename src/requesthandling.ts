
import {encodeError} from "./resp_encoder"
import {COMMANDS} from "./commands";
import {RESP_Data} from "./globals";

export function handleRequest(request: RESP_Data) {
    try{
        if (!Array.isArray(request)) {
            // check if the buffer contains an Array
            return encodeError("Request is bad formated.")
        }
        const commandName = String(request[0]).toUpperCase()
        const command = COMMANDS.get(commandName)
        if (!command){
            return encodeError("Command is unknown.")
        }

        return command.exec(request)

    } catch (e) {
        return encodeError((e as Error).message)
    }
}