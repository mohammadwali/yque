const store = chrome.storage.sync;

export const setData = (data) => {
    return new Promise(resolve => {
        store.set({'currentQue': data}, (result) => resolve(result));
    });
};

export const getData = () => {
    return new Promise(resolve => {
        store.get(['currentQue'], (data) => resolve(data))
    });
};
