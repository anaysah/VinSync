// logger.js
function log(context: string, data: any) {
    chrome.runtime.sendMessage({ type: 'log', context: context, data: data });
}

export {log};