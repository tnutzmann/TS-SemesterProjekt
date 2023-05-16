import * as encoder from "../src/resp_encoder";

test("encode SimpleString", () => {
    expect(encoder.encodeSimpleString("OK")).toStrictEqual("+OK\r\n")
})

test("encode BulkString", () => {
    expect(encoder.encodeBulkString("hello")).toStrictEqual("$5\r\nhello\r\n")
    expect(encoder.encodeBulkString(null)).toStrictEqual("$-1\r\n")
})

test("encode Integer", () => {
    expect(encoder.encodeInteger(1000)).toStrictEqual(":1000\r\n")
    expect(encoder.encodeInteger(-1000)).toStrictEqual(":-1000\r\n")
    expect(() => encoder.encodeInteger(-420.69)).toThrowError(new TypeError("The given Parameter is not an INTEGER!"))
})

test("encode Array", () => {
    expect(encoder.encodeArray(["Hello", "World"])).toStrictEqual("*2\r\n$5\r\nHello\r\n$5\r\nWorld\r\n")
    expect(encoder.encodeArray([1, 2, 3, 4, 5])).toStrictEqual("*5\r\n:1\r\n:2\r\n:3\r\n:4\r\n:5\r\n")
    expect(encoder.encodeArray(["four", 4, "4"])).toStrictEqual("*3\r\n$4\r\nfour\r\n:4\r\n$1\r\n4\r\n")
    expect(encoder.encodeArray([[1, 2], "three"])).toStrictEqual("*2\r\n*2\r\n:1\r\n:2\r\n$5\r\nthree\r\n")
    expect(encoder.encodeArray(null)).toStrictEqual("*-1\r\n")
})

test("encode Error", () => {
    expect(encoder.encodeError("Error message")).toStrictEqual("-Error message\r\n")
})
