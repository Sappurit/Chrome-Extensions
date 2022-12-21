chrome.action.onClicked.addListener(function ()
{
	let url = 'chrome://extensions';
	chrome.tabs.create({url: url});
});
