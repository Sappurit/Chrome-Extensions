chrome.action.onClicked.addListener(function ()
{
	let url = 'chrome://settings';
	chrome.tabs.create({url: url});
});
