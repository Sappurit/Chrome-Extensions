
var url = "chrome://extensions";

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({url: url});
});
