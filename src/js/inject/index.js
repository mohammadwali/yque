import '../../css/inject.css';
import {connection} from './connection';
import * as store from './storage';

const $ = require('jquery');
require('jquery-ui-bundle');


const WATCH_PAGE_SLUG = '/watch';
const ADD_TO_QUE_WATCH_DELAY = 1000;

let _cachedQueList = [];
let addButtonInterval = null;
const body = window.document.body;

const isWatchPage = _ => window.location.pathname.indexOf(WATCH_PAGE_SLUG) !== -1;

const generateList = queList => {
    const list = createElem('yq__list');

    queList.forEach((item, index) => {
        const listItem = createElem('yq__list--item');

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

        const itemDuration = createElem('yq__itemViews yq__footer--infoBlock');
        itemDuration.innerHTML = `${item.duration}`;
        listItemFooter.appendChild(itemDuration);

        const itemAuthor = createElem('yq__itemAuthor yq__footer--infoBlock');
        itemAuthor.innerHTML = item.author;
        listItemFooter.appendChild(itemAuthor);


        listItem.appendChild(listItemFooter);

        //append list item to list
        list.appendChild(listItem);

        //add data reference to list item
        $(listItem).data('item', item);
    });

    return list;
};

const setupQueTemplate = queList => {
    const sortableOptions = {
        handle: '.yq__itemDrag--wrapper',
        placeholder: 'yq__item--placeholder',
        stop: handleDragStop
    };
    const root = createElem('yq__container', {
        id: 'yq__root--container'
    });
    const containerBody = createElem('yq__container--body');
    const list = generateList(queList);

    _cachedQueList = queList;

    document.body.appendChild(root);
    root.appendChild(containerBody);
    containerBody.appendChild(list);

    if (!$(list).hasClass('ui-sortable')) {
        $(list).sortable(sortableOptions);
    }
};

const handleDragStop = event => {
    setTimeout(() => {
        const listItems = $(event.target).find('.yq__list--item');

        //updating index
        listItems.each((index, elem) => $(elem).find('.yq__list--itemIndex').text(index + 1));

        //updating index to store
        store.setQueList(listItems.map((_, elem) => $(elem).data('item')).toArray())
    }, 0);
};

const updateActionButton = thumb => {
    const foundIcon = thumb.find('.yq__addToQue--icon');
    const hasIcon = foundIcon.length;
    const videoId = parseVideoId(thumb.find('a.ytd-thumbnail').attr('href'));
    const isAdded = _cachedQueList.find(item => item.id === videoId);

    thumb.addClass('yq__injected');

    if (!hasIcon) {
        thumb.append(createElem('yq__addToQue--icon yq__addToQue--previewIcon'));
    }

    const icon = thumb.find('.yq__addToQue--icon');

    if (isAdded) {
        return icon.removeClass('yq__addToQue--iconAdd')
            .addClass('yq__addToQue--iconRemove')
            .text('- Remove');
    }

    icon.removeClass('yq__addToQue--iconRemove')
        .addClass('yq__addToQue--iconAdd')
        .text('+ Add');
};

const refreshActionButtons = _ => {
    $('ytd-compact-video-renderer ytd-thumbnail:not(.yq__injected)')
        .each(function () {
            const thumb = $(this);
            updateActionButton(thumb);
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

const parseVideoId = str => {
    let url = str;

    if (str.indexOf('://') === -1) {
        url = `https://youtube.com${str}`;
    }

    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get('v');
};

const createItemPayload = rootElem => ({
    author: rootElem.find('#byline').text(),
    title: rootElem.find('#video-title').text(),
    views: rootElem.find('#metadata-line > span').text(),
    id: parseVideoId(rootElem.find('a').attr('href')),
    duration: rootElem.find('ytd-thumbnail-overlay-time-status-renderer > span').text()
});

const handleActionButtonClick = event => {
    const root = $(event.target).parents('ytd-compact-video-renderer:first');
    const icon = root.find('.yq__addToQue--icon');
    const action = icon.hasClass('yq__addToQue--iconAdd') ?
        store.addItemToQue(createItemPayload(root)) :
        store.removeItemFromQue(parseVideoId(root.find('a').attr('href')));

    action
        .then(que => setupQueTemplate(que))
        .then(_ => updateActionButton(root.find('ytd-thumbnail')));
};

const initialize = async _ => {

    //todo watch on html route change
    // if (isWatchPage()) {
    const que = await store.getQueList();
    setupQueTemplate(que);
    //}

    body.classList.add('yq-injected');
    addButtonInterval = setInterval(_ => refreshActionButtons(), ADD_TO_QUE_WATCH_DELAY);

    $(document).on('click', '.yq__addToQue--previewIcon', handleActionButtonClick);
};


initialize();