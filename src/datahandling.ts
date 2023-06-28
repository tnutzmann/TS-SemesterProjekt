import {RESP_Data} from "./globals";

const redis_data: Map<string, RESP_Data> = new Map<string, string>()

export function setData(key: string, value: RESP_Data | undefined):void {
    if(value === undefined) {
        redis_data.delete(key)
    } else {
        redis_data.set(key, value);
    }
}

export function getData(key: string): RESP_Data | undefined {
    return redis_data.get(key);
}