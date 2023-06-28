export const CRLF = "\r\n"
export const CR = "\r"
export const LF = "\n"

// the Datatype you can serialise with RESP
export type RESP_Data = number | null | string | RESP_Data[] // RESP_DATA could be an array of RESP_Data

// Datatypeprefix from the RESP documentation
export enum RespPrefix {
    SimpleString = '+', // +OK\r\n
    BulkString = '$', // $5\r\nhello\r\n
    Integer = ':', // :1000\r\n
    Array = '*', // *2\r\n$5\r\nhello\r\n$5\r\nworld\r\n
    Error = '-' // -Error message\r\n
}

// helper to return some RESP_Date and an offset value
// (works like a Tuple in Python)
export type RESP_Segment = {
    value: RESP_Data,
    offset: number
}