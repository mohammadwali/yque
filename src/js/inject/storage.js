const store = chrome.storage.sync;
const keymap = {
    que: 'queList'
};

export const setQueList = list => new Promise(resolve => {
    store.set(
        {[keymap.que]: list},
        result => resolve(result)
    );
});

export const getQueList = () => new Promise(resolve => {
    store.get(
        [keymap.que],
        result => resolve(result[keymap.que] || [])
    );
});

export const addItemToQue = item => getQueList()
    .then(currentQue => (currentQue || []).concat([item]))
    .then(currentQue => setQueList(currentQue).then(() => currentQue));