
var url = "chrome://settings";

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({url: url});
});
