
var url = "chrome://downloads";

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({url: url});
});
