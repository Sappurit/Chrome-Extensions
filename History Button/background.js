
var url = "chrome://history";

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({url: url});
});
