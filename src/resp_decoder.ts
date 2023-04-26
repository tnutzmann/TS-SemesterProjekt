const CRLF = "\r\n"
const CR = "\r"
const LF = "\n"

// the Datatype you can serialise with RESP
export type RESP_Data = number | null | string | RESP_Data[] // RESP_DATA could be an array of RESP_Data

// Datatypeprefix from the RESP documentation
enum RespPrefix {
    SimpleString = '+', // +OK\r\n
    BulkString = '$', // $5\r\nhello\r\n
    Integer = ':', // :1000\r\n
    Array = '*', // *2\r\n$5\r\nhello\r\n$5\r\nworld\r\n

Error = '-' // -Error message\r\n
}

// helper to return some RESP_Date and an offset value
// (works like a Tuple in Python)
type RESP_Segment = {
    value: RESP_Data
    offset: number
}

export function decodeRESP(buffer: Buffer): RESP_Data {
    try {
    return parse(buffer).value
    } catch (e) {
        // throw the error up to the caller (probably the client)
        throw e
    }
}

function parse(buffer: Buffer, offset=0): RESP_Segment {
    // reads the first Char from the Buffer and increase the offset
    const prefix = String.fromCharCode(buffer.readUInt8(offset++))

    // use the right decoder by datatype
    if(prefix == RespPrefix.SimpleString) {
        return decodeSimpleString(buffer, offset)
    } else if(prefix == RespPrefix.BulkString) {
        return decodeBulkString(buffer, offset)
    } else if(prefix == RespPrefix.Integer) {
        return decodeInteger(buffer, offset)
    } else if(prefix == RespPrefix.Array) {
        return decodeArray(buffer, offset)
    } else if(prefix == RespPrefix.Error) {
        const error = decodeError(buffer, offset)
        throw new Error(String(error))
    } else {
        throw new Error(`RESP decode error: unknown prefix -> ${prefix}.`);
    }
}

// read the value byte by byte from the buffer until CRLF
function readSegment(buffer: Buffer, offset: number): RESP_Segment{
    let byte = '' // the byte to read
    let value = "" // the value from the buffer

    try {
        // read until the buffer ends or CR occurs
        for(;offset < buffer.length && byte !== CR; offset++) {
            value += byte
            byte = String.fromCharCode(buffer.readUInt8(offset))
        }
        // check if after CR comes LF
        byte = String.fromCharCode(buffer.readUInt8(offset++))
        if (byte !== LF)  {
            throw new Error();
        }
    } catch (e) {
        throw new Error("RESP decode error: didn't terminate with CRLF.");
    }

    return {value, offset}
}

// Decoders for the different Datatyps RESP supports
// offset defaults to 1 because the 0th byte/char is the prefix
function decodeSimpleString(buffer: Buffer, offset=1): RESP_Segment {
    // just read until the end and return
     return readSegment(buffer, offset)
}

function decodeBulkString(buffer: Buffer, offset=1): RESP_Segment {
    // read the length of the string
    let resp_segment = readSegment(buffer, offset) // contains the length
    offset = resp_segment.offset // set the new offset
    const string_length = parseInt(String(resp_segment.value), 10) // the lenght the string SHOULD have

    // NaN check
    if(Number.isNaN(string_length)) {
        throw new Error('RESP decode error: length of the BulkString is NaN.')
    }

    // negative length check
    if(string_length < 0) {
        return {value : null, offset}
    }

    resp_segment = readSegment(buffer, offset) // contains the String
    // lenght check
    if(String(resp_segment.value).length !== string_length) {
        throw new Error("RESP decode error: length of the BulkString is not the lenght it should be.")
    }

    return resp_segment
}

function decodeInteger(buffer: Buffer, offset=1): RESP_Segment {
    const int = parseInt(String(readSegment(buffer, offset).value), 10)

    // NaN check
    if(Number.isNaN(int)) {
        throw new Error("RESP decode error: Integer is NaN.")
    }
    return {value : int, offset}
}

function decodeArray(buffer: Buffer, offset=1): RESP_Segment {
    const element_count_segment = readSegment(buffer, offset) // segment that stores the number of elements
    const element_count = parseInt(String(element_count_segment.value)) // number of elements in the array
    const elements: RESP_Data = []
    offset = element_count_segment.offset

    // NaN check
    if(Number.isNaN(element_count)) {
        throw new Error('RESP decode error: length of the BulkString is NaN.')
    }

    for(let i = 0; i < element_count; i++) {
        const element_segment = parse(buffer, offset)
        offset = element_segment.offset
        elements.push(element_segment.value)
    }

    return {value : elements, offset}
}

function decodeError(buffer: Buffer, offset=1): RESP_Segment {
    // more or less the same
    return decodeSimpleString(buffer, offset)
}