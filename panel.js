/*
 * chrome.* APIs:
 *
 * extension (getURL, inIncognitoContext, lastError, onRequest, sendRequest)
 * i18n
 * runtime (connect, getManifest, getURL, id, onConnect, onMessage, sendMessage)
 * storage
 * devtools.inspectedWindow
 * devtools.network
 * devtools.panels
 */

var port = chrome.runtime.connect({ name: 'panel' });

port.postMessage({
    type: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

document.getElementById('run').addEventListener('click', function () {

    port.postMessage({
        type: 'log',
        text: 'hello'
    });

}, false);
