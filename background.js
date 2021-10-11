/* global chrome */

const panels = []

function onPanelMessage(port, message) {
  switch (message.type) {
    case 'init':
      panels.push({
        port: port,
        tabId: message.tabId,
      })
      return
  }

  const panel = getPanelByPort(port)

  if (panel) {
    chrome.tabs.sendMessage(panel.tabId, message)
  }
}

function find(items, key, value) {
  let item

  for (let i = 0; i < items.length; i++) {
    item = items[i]

    if (item && item[key] === value) {
      return i
    }
  }

  return -1
}

function getPanelByPort(port) {
  const i = find(panels, 'port', port)

  return (i >= 0 ? panels[i] : null)
}

function getPanelByTabId(tabId) {
  const i = find(panels, 'tabId', tabId)

  return (i >= 0 ? panels[i] : null)
}

// panel connection
chrome.runtime.onConnect.addListener(function onConnect(port) {
  if (port.name !== 'panel') {
    return
  }

  function panelListener(message) {
    onPanelMessage(port, message)
  }

  port.onMessage.addListener(panelListener)

  port.onDisconnect.addListener(function onDisconnect(port) {
    port.onMessage.removeListener(panelListener)

    const i = find(panels, 'port', port)

    if (i >= 0) {
      panels.splice(i, 1)
    }
  })
})

// message from content script
chrome.runtime.onMessage.addListener(function onMessage(message, sender) {
  console.log('content:', message)

  const tab = sender.tab
  let panel

  if (tab) {
    panel = getPanelByTabId(tab.id)

    if (panel) {
      panel.port.postMessage(message)
    }
  }

  return true
})
