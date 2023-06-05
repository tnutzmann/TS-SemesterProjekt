import {CRLF, RESP_Data, RespPrefix} from "./globals"

export function encodeSimpleString(data: string): string {
    return RespPrefix.SimpleString + data + CRLF;
}

export function encodeBulkString(data: string | null): string {
    // null is a possibility mentioned by the REDIS-Docs
    if (data === null) return RespPrefix.BulkString + -1 + CRLF;
    return RespPrefix.BulkString + data.length + CRLF + data + CRLF;
}

export function encodeInteger(data: number): string {
    if(Number.isInteger(data)) return RespPrefix.Integer + data + CRLF;
    throw new TypeError("The given Parameter is not an INTEGER!")
}

export function encodeArray(data: RESP_Data[]): string {
    // null
    if(data === null) return RespPrefix.Array + -1 + CRLF
    // number of elements
    let encodedArray = RespPrefix.Array + data.length + CRLF;
    data.forEach((d) => {
        // number encoding
        if(typeof d === "number") encodedArray += encodeInteger(d);
        // string or null encoding
        else if(typeof d === "string" || d === null) encodedArray += encodeBulkString(d);
        // the last option should be the RESP_Data[]
        else if(Array.isArray(d)) {
            encodedArray += encodeArray(d)
        } else {
            throw new TypeError("encode array failed. Input dont seems to be null, number, string or an Array of them.")
        }
    });
    return encodedArray;
}

export function encodeError(data: string): string {
    return RespPrefix.Error + data + CRLF;
}
