/*
 * chrome.* APIs:
 *
 * extension (getURL, inIncognitoContext, lastError, onRequest, sendRequest)
 * i18n
 * runtime (connect, getManifest, getURL, id, onConnect, onMessage, sendMessage)
 * storage
 *
 * Not possible to use variables or functions defined by:
 *
 * extension pages
 * web pages
 * other content scripts
 */

chrome.runtime.onMessage.addListener(function (message) {

    switch (message.type) {

    case 'log':
        console.log(message.text);
        break;
    }
});
