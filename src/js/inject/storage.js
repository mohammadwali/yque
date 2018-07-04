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
    .then(currentQue => {
        const currentItem = currentQue.find(i => i.id === item.id);

        if (!currentItem) {
            return setQueList(currentQue)
                .then(_ => currentQue);
        }

        return currentQue;
    });