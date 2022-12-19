
chrome.browserAction.onClicked.addListener(function()
{
	let url = 'chrome://bookmarks';
	chrome.tabs.create({url: url});
});

