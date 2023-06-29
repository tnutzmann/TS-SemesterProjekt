
import {encodeError} from "./resp_encoder"
import {COMMANDS} from "./commands";
import {RESP_Data} from "./globals";

export function handleRequest(request: RESP_Data) {
    try{
        // console.log(handleRequest.name, request)
        if (!Array.isArray(request)) {
            // check if the buffer contains an Array
            return encodeError("Request is bad formated.")
        }
        const commandName = String(request[0]).toUpperCase()
        const command = COMMANDS.get(commandName)
        if (!command){
            return encodeError("Command is unknown.")
        }
        let res = command.exec(request)
        // console.log(handleRequest.name, res)
        return res

    } catch (e) {
        return encodeError((e as Error).message)
    }
}