const store = chrome.storage.sync;
const keymap = {
    que: 'queList',
    status: 'queStatus'
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
    .then(currentQue => {
        const currentItem = currentQue.find(i => i.id === item.id);

        if (!currentItem) {
            currentQue = (currentQue || []).concat([item]);

            return setQueList(currentQue)
                .then(_ => currentQue);
        }

        return currentQue;
    });


export const removeItemFromQue = itemId => getQueList()
    .then(currentQue => {
        const currentItemIndex = currentQue.findIndex(i => i.id === itemId);

        if (currentItemIndex !== -1) {
            currentQue.splice(currentItemIndex, 1);

            return setQueList(currentQue)
                .then(_ => currentQue);
        }

        return currentQue;
    });

export const setQueStatus = (status) => new Promise(resolve => {
    store.set(
        {[keymap.status]: status},
        result => resolve(result)
    );
});

export const getQueStatus = () => new Promise(resolve => {
    store.get(
        [keymap.status],
        result => {
            console.log("result", result);
            return resolve([])
        }
    );
});