import {decodeRESP} from "./resp_decoder";
import {encodeError, encodeSimpleString} from "./resp_encoder"

export function handleRequest(buffer: Buffer) {
    try{
        const request = decodeRESP(buffer)
    } catch (e) {
        return encodeError((e as Error).message)
    }
}