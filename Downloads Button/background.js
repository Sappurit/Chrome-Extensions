
//-----------------------------------------------------------------------------

var debug = 1;

//-----------------------------------------------------------------------------

chrome.browserAction.onClicked.addListener(function()
{
	let url = "chrome://downloads";
	chrome.tabs.create({url: url});

	updateBadge();
});

//-----------------------------------------------------------------------------

chrome.downloads.onCreated.addListener(function(downloadItem)
{
	debugLog('onCreated');
	debugLog(downloadItem);

	if (downloadItem.id)
	{
		updateBadge();
	}
});

//-----------------------------------------------------------------------------

chrome.downloads.onChanged.addListener(function(downloadDelta)
{
	debugLog('onChanged');
	debugLog(downloadDelta);

	if (downloadDelta.id)
	{
		updateBadge();
	}
});

//-----------------------------------------------------------------------------

function debugLog(text)
{
	if (debug) console.log(text);
}

//-----------------------------------------------------------------------------

function updateBadge()
{
	let count = new Promise((resolve) => {
		chrome.downloads.search({state: 'in_progress'}, (results) => {
			let len = results.length;
			debugLog('in_progress : ' + len.toString());
			debugLog(results);
			resolve(len);
		});
	});

	let error = new Promise((resolve) => {
		chrome.downloads.search({state: 'interrupted'}, (results) => {
			let len = results.length;
			debugLog('interrupted : ' + len.toString());
			debugLog(results);
			resolve(len);
		});
	});

	if (count > 0 && error > 0)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: '#D90000'});	//Red
		chrome.browserAction.setBadgeText({text: count.toString() + '/' + error.toString()});
		chrome.downloads.setShelfEnabled(true);
		return;
	}

	if (count == 0 && error > 0)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: '#D90000'});	//Red
		chrome.browserAction.setBadgeText({text: error.toString()});
		chrome.downloads.setShelfEnabled(true);
		return;
	}

	if (count > 0 && error == 0)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: '#696969'});	//Gray
		chrome.browserAction.setBadgeText({text: count.toString()});
		chrome.downloads.setShelfEnabled(true);
		return;
	}

	if (count == 0 && error == 0)
	{
		chrome.browserAction.setBadgeText({text: null});
		chrome.downloads.setShelfEnabled(false);
		return;
	}
}

//-----------------------------------------------------------------------------

/*
"in_progress", "interrupted", or "complete"
"FILE_FAILED", "FILE_ACCESS_DENIED", "FILE_NO_SPACE", "FILE_NAME_TOO_LONG", "FILE_TOO_LARGE", "FILE_VIRUS_INFECTED", "FILE_TRANSIENT_ERROR", "FILE_BLOCKED", "FILE_SECURITY_CHECK_FAILED", "FILE_TOO_SHORT", "FILE_HASH_MISMATCH", "FILE_SAME_AS_SOURCE", 
"NETWORK_FAILED", "NETWORK_TIMEOUT", "NETWORK_DISCONNECTED", "NETWORK_SERVER_DOWN", "NETWORK_INVALID_REQUEST", 
"SERVER_FAILED", "SERVER_NO_RANGE", "SERVER_BAD_CONTENT", "SERVER_UNAUTHORIZED", "SERVER_CERT_PROBLEM", "SERVER_FORBIDDEN", "SERVER_UNREACHABLE", "SERVER_CONTENT_LENGTH_MISMATCH", "SERVER_CROSS_ORIGIN_REDIRECT", 
"USER_CANCELED", "USER_SHUTDOWN", ,"CRASH"
*/

//-----------------------------------------------------------------------------

