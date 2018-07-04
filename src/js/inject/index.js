import '../../css/inject.css';
import {connection} from './connection';
import * as store from './storage';

const $ = require('jquery');
require('jquery-ui-bundle');


const WATCH_PAGE_SLUG = '/watch';
const ADD_TO_QUE_WATCH_DELAY = 1000;

let addButtonInterval = null;
const body = window.document.body;

const isWatchPage = _ => window.location.pathname.indexOf(WATCH_PAGE_SLUG) !== -1;

const generateList = queList => {
    const list = createElem('yq__list', {});

    queList.forEach((item, index) => {
        const listItem = createElem('yq__list--item', {
            'data-index': index,
            'data-video-id': item.id
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
            width: 72,
            src: `https://i.ytimg.com/vi/${item.id}/default.jpg`
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

        const itemViews = createElem('yq__itemViews yq__footer--infoBlock');
        itemViews.innerHTML = `${item.views}`;
        listItemFooter.appendChild(itemViews);

        const itemAuthor = createElem('yq__itemAuthor yq__footer--infoBlock');
        itemAuthor.innerHTML = item.author;
        listItemFooter.appendChild(itemAuthor);


        listItem.appendChild(listItemFooter);

        //append list item to list
        list.appendChild(listItem);
    });

    return list;
};

const setupQueTemplate = queList => {
    const sortableOptions = {
        handle: '.yq__itemDrag--wrapper',
        placeholder: 'yq__item--placeholder'
    };
    const root = createElem('yq__container', {
        id: 'yq__root--container'
    });
    const containerBody = createElem('yq__container--body');
    const list = generateList(queList);
    document.body.appendChild(root);
    root.appendChild(containerBody);
    containerBody.appendChild(list);

    if (!$(list).hasClass('ui-sortable')) {
        $(list).sortable(sortableOptions);
    }
};

const appendAddToQueButtons = _ => {
    const icon = createElem('yq__addToQue--icon yq__addToQue--previewIcon');
    icon.innerHTML = '+ Add';

    $('ytd-compact-video-renderer ytd-thumbnail')
        .each(function () {
            const thumb = $(this);
            const hasIcon = thumb.find('.yq__addToQue--icon').length;
            if (!hasIcon) thumb.append(icon);
        });
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

const createItemPayload = rootElem => ({
    author: rootElem.find('#byline').text(),
    title: rootElem.find('#video-title').text(),
    views: rootElem.find('#metadata-line > span').text(),
    id: rootElem.find('a').attr('href').replace('/watch?v=', ''),
    duration: rootElem.find('ytd-thumbnail-overlay-time-status-renderer > span').text()
});

const initialize = _ => {
    body.classList.add('yq-injected');

//todo watch on html route change
    if (isWatchPage()) {
        store.getQueList()
            .then(que => setupQueTemplate(que));
    }

    $(document).on('click', '.yq__addToQue--previewIcon', function () {
        const root = $(this).parents('ytd-compact-video-renderer:first');

        store.addItemToQue(createItemPayload(root))
            .then(que => setupQueTemplate(que));
    });


    addButtonInterval = setInterval(_ => appendAddToQueButtons(), ADD_TO_QUE_WATCH_DELAY);

    connection.send(connection.todo.PING);
};



initialize();