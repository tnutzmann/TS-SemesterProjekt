import {getData,setData} from "../src/datahandling";

test("Test datahandling", () => {
    expect(getData("test")).toBe(undefined)
    setData("test", "test")
    expect(getData("test")).toBe("test")
    setData("test", "successful")
    expect(getData("test")).toBe("successful")
    setData("test", undefined)
    expect(getData("test")).toBe(undefined)
})