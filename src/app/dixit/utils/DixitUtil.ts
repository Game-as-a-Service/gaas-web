const delay = (timeout: number, callback: () => void) => {
    setTimeout(() => callback(), timeout);
};

export {delay};