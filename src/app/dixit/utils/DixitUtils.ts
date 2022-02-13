const delay = (timeout: number, callback: () => void) => {
    setTimeout(callback, timeout);
};

const generate = <T>(t: T, times: number): Array<T> => {
    const result: T[] = [];
    for (let index: number = 0; index < times; index++) {
        result.push(t);
    }
    return result;
}

const executeIfExist = (consumer?: () => void): void => {
    if (consumer) {
        consumer();
    }
}

export {delay, generate, executeIfExist};