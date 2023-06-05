const redis_data: Map<string, string> = new Map<string, string>()

export function setData(key: string, value: any):void {
    redis_data.set(key, value);
}

export function getData(key: string): string | undefined {
    return redis_data.get(key);
}