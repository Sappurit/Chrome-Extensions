
chrome.browserAction.onClicked.addListener(function()
{
	let url = 'chrome://extensions';
	chrome.tabs.create({url: url});
});

