import {handleRequest} from "../src/requesthandling";

// technically this isn't a unit test, I know

test("Test SET and GET requests", () =>{
    expect(handleRequest([ 'SET', 'testKey', 'testValue' ])).toStrictEqual("+OK\r\n")
    expect(handleRequest(['GET', 'testKey'])).toStrictEqual("$9\r\ntestValue\r\n")
    expect(handleRequest([ 'SET', 'testKey', 'testValue2' ])).toStrictEqual("+OK\r\n")
    expect(handleRequest(['GET', 'testKey'])).toStrictEqual("$10\r\ntestValue2\r\n")
})

test("Test Ping", () => {
    expect(handleRequest([ 'PING' ])).toStrictEqual("+PONG\r\n")
    expect(handleRequest([ 'PING', 'test' ])).toStrictEqual("+test\r\n")
    expect(handleRequest([ 'PING', 'foo', 'bar' ])).toStrictEqual("-To many arguments for PING\r\n")
})

test("falsy data", () => {
    expect(handleRequest("SET testKey testValue")).toStrictEqual("-Request is bad formated.\r\n")
    expect(handleRequest([ 'FOO' ])).toStrictEqual("-Command is unknown.\r\n")
})