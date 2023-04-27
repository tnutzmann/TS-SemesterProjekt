import {decodeRESP} from "../src/resp_decoder";
import {RESP_Data} from "../src/basics";

test("decode SimpleString", () => {
    const simpleOK = Buffer.from("+OK\r\n")
    expect(String(decodeRESP(simpleOK))).toBe("OK")
})

test("decode BulkString", () => {
    const bulkString = Buffer.from("$5\r\nHello\r\n")
    expect(String(decodeRESP(bulkString))).toBe("Hello")
})

test("decode Integer", () => {
    const int = Buffer.from(":1000\r\n")
    expect(Number(decodeRESP(int))).toBe(1000)
})

test("decode Array", () => {
    const inputArray = Buffer.from("*2\r\n$5\r\nHello\r\n$5\r\nWorld\r\n")
    const outputArray: RESP_Data = ["Hello", "World"]
    expect(decodeRESP(inputArray)).toStrictEqual(outputArray)
})

test("decode Error", () => {
    const error = Buffer.from("-Error message\r\n")
    expect(() => decodeRESP(error)).toThrowError(new Error("Error message")) // hier einmal achfragen
})
// -Error message\r\n