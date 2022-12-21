chrome.action.onClicked.addListener(function ()
{
	let url = 'chrome://history';
	chrome.tabs.create({url: url});
});
