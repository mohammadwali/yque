import '../img/icon-128.png'
import '../img/icon-34.png'


chrome.runtime.onConnect.addListener(port => {
    const onMessage = (request, {sender: {tab}}) => {
        const send = data => port.postMessage({
            data: data,
            id: request.id,
            todo: request.todo
        });

        switch (request.todo) {
            case 'ping':
                send('pong');
                break;

            default:
                send();
                break;
        }
    };

    port.onMessage.addListener(onMessage);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let key in changes) {
        const storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});
