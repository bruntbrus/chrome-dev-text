var panels = [];

function onPanelMessage(port, message) {

    switch (message.type) {

    case 'init':
        panels.push({
            port: port,
            tabId: message.tabId
        });
        return;
    }

    var panel = getPanelByPort(port);

    if (panel) {
        chrome.tabs.sendMessage(panel.tabId, message);
    }
}

function find(items, key, value) {

    var item;

    for (var i = 0; i < items.length; i++) {
        item = items[i];

        if (item && item[key] === value) {
            return i;
        }
    }

    return -1;
}

function getPanelByPort(port) {

    var i = find(panels, 'port', port);

    return (i >= 0 ? panels[i] : null);
}

function getPanelByTabId(tabId) {

    var i = find(panels, 'tabId', tabId);

    return (i >= 0 ? panels[i] : null);
}

// panel connection
chrome.runtime.onConnect.addListener(function (port) {

    if (port.name !== 'panel') {
        return;
    }

    function panelListener(message) {

        onPanelMessage(port, message);
    }

    port.onMessage.addListener(panelListener);

    port.onDisconnect.addListener(function (port) {

        port.onMessage.removeListener(panelListener);

        var i = find(panels, 'port', port);

        if (i >= 0) {
            panels.splice(i, 1);
        }
    });
});

// message from content script
chrome.runtime.onMessage.addListener(function (message, sender) {

    console.log('content:', message);

    var tab = sender.tab;
    var panel;

    if (tab) {
        panel = getPanelByTabId(tab.id);

        if (panel) {
            panel.port.postMessage(message);
        }
    }

    return true;
});
