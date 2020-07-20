
var url = "chrome://bookmarks";

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({url: url});
});
