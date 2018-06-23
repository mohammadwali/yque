import '../css/inject.css';

(function (window, undefined, factory) {

    // create a port to send and recive
    // message with background app
    const port = chrome.runtime.connect();

    // // send an initial message to background
    // // that content script is injected
    // port.postMessage({
    //   injected: true
    // });

    // //listener to recive messages from background
    // port.onMessage.addListener(function(response) {
    //   if (response.init) factory(window, undefined, port)
    // });

    factory(window, undefined, port);
})(window, undefined, function (window, undefined, port) {
    const WATCH_PAGE_SLUG = '/watch';
    const body = window.document.body;
    const isWatchPage = _ => window.location.pathname.indexOf(WATCH_PAGE_SLUG) !== -1;
    const setupQueTemplate = queList => {
        const root = createElem('yq__container', {id: 'yq__root--container'});
        const containerBody = createElem('yq__container--body');
        const list = createElem('yq__list', {});

        queList.forEach((item, index) => {
            const listItem = createElem('yq__list--item', {
                'data-index': index,
                'data-video-id': index //todo change this when data will arrive
            });

            //item number
            const itemIndex = createElem('yq__list--itemIndex', {});
            itemIndex.innerHTML = (index + 1);
            listItem.appendChild(itemIndex);


            //drag handler
            const dragWrapper = createElem('yq__itemDrag--wrapper');
            const dragHandler = createElem('yq__itemDrag--handler');
            dragWrapper.appendChild(dragHandler);
            listItem.appendChild(dragWrapper);


            //thumbnail
            const thumbContainer = createElem('yq__itemThumb--container');
            const thumbHolder = createElem('yq__itemThumb--holder');
            const thumbWrapper = createElem('yq__itemThumb--wrapper');
            const thumbnail = createElem('yq__itemThumb--img', {
                //todo change this
                width: 72,
                src: 'https://i.ytimg.com/vi/T5eQ-Vo_3EQ/default.jpg'
            }, 'img');
            thumbHolder.appendChild(thumbnail);
            thumbWrapper.appendChild(thumbHolder);
            thumbContainer.appendChild(thumbWrapper);
            listItem.appendChild(thumbContainer);


            //title
            const itemTitle = createElem('yq__itemTitle');
            itemTitle.innerHTML = item.title;
            listItem.appendChild(itemTitle);

            //const author and stats in footer
            const listItemFooter = createElem('yq__item--row yq__item--footer');
            const itemAuthor = createElem('yq__itemAuthor');
            itemAuthor.innerHTML = item.author;
            listItemFooter.appendChild(itemAuthor);
            listItem.appendChild(listItemFooter);

            //append list item to list
            list.appendChild(listItem);
        });

        containerBody.appendChild(list);
        root.appendChild(containerBody);
        //
        //
        //
        // <div class="yq__container" id="yq__root--container">
        //
        //         <div class="yq__container--body">
        //         <ul class="yq__list">
        //         <li class="yq__list--item">
        //         <a class="yq__item--link">Official: Best Travelling songs</a>
        //     </li>
        //     </ul>
        //     </div>
        //
        //
        //     </div>

        body.appendChild(root);
    };


    const createElem = (classNames = '', attributes = {}, elm = 'div') => {
        const element = document.createElement(elm);
        classNames.split(' ')
            .forEach(className => element.classList.add(className));

        //append attributes
        Object.entries(attributes)
            .forEach(([attr, value]) => element.setAttribute(attr, value));

        return element;
    };


    body.classList.add('yq-injected');


   // if (isWatchPage()) {

        const itemsList = [
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'Mix - OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'T-SERIES',
                title: 'OFFICIAL: Best Travelling Songs of Bollywood | Road Trip Songs | T-SERIES'
            },
            {
                views: 6468853,
                author: 'Padukone',
                title: 'Ilahi Yeh Jawaani Hai Deewani Full Video Song | Ranbir Kapoor, Deepika Padukone'
            }
        ];


        setupQueTemplate(itemsList);
   // }
});
