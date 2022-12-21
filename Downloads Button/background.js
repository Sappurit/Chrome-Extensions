
//-----------------------------------------------------------------------------

var debug = 0;

//-----------------------------------------------------------------------------

updateBadge();

//-----------------------------------------------------------------------------

chrome.action.onClicked.addListener(function ()
{
	let url = "chrome://downloads";
	chrome.tabs.create({url: url});
});

//-----------------------------------------------------------------------------

chrome.downloads.onCreated.addListener(function (downloadItem)
{
	debugLog('onCreated ------------------------------------------------');
	debugLog(downloadItem);
	if (downloadItem.state) updateBadge();
});

//-----------------------------------------------------------------------------

chrome.downloads.onChanged.addListener(function (downloadDelta)
{
	debugLog('onChanged ------------------------------------------------');
	debugLog(downloadDelta);
	if (downloadDelta.state) updateBadge();
});

//-----------------------------------------------------------------------------

chrome.downloads.onErased.addListener(function (downloadId)
{
	debugLog('onErased -------------------------------------------------');
	debugLog(downloadId);
	if (downloadId) updateBadge();
});

//-----------------------------------------------------------------------------

function debugLog(text)
{
	if (debug) console.log(text);
}

//-----------------------------------------------------------------------------

function updateBadge()
{
	// [BUG] state: 'interrupted' didn't return all the interrupted items.
	// [BUG] error: property will return all download items.

	// let searchInProgress  = chrome.downloads.search({state: 'in_progress'});
	// let searchInterrupted = chrome.downloads.search({state: 'interrupted'});

 	let searchDownloads = chrome.downloads.search({});	// Fixed bugs by query all download items in one shot and using filter.

	searchDownloads.then(function (results)
	{
		let downloading = results.filter(log => log.state === 'in_progress');
		let interrupted = results.filter(log => log.error !== 'USER_CANCELED' && log.error !== undefined );

		let count = downloading.length;
		let error = interrupted.length;

		debugLog(results);
		debugLog('in_progress : ' + count);
		debugLog(downloading);
		debugLog('interrupted : ' + error);
		debugLog(interrupted);

		if (count == 0 && error == 0)
		{
			chrome.action.setBadgeText({text: ''});
			chrome.downloads.setShelfEnabled(false);
			return;
		}

		if (count > 0 && error == 0)
		{
			chrome.action.setBadgeBackgroundColor({color: '#696969'});	//Gray
			chrome.action.setBadgeText({text: count.toString()});
			chrome.downloads.setShelfEnabled(true);
			return;
		}

		if (count == 0 && error > 0)
		{
			chrome.action.setBadgeBackgroundColor({color: '#D90000'});	//Red
			chrome.action.setBadgeText({text: error.toString()});
			chrome.downloads.setShelfEnabled(true);
		}

		if (count > 0 && error > 0)
		{
			chrome.action.setBadgeBackgroundColor({color: '#D90000'});	//Red
			chrome.action.setBadgeText({text: count.toString() + '/' + error.toString()});
			chrome.downloads.setShelfEnabled(true);
			return;
		}
	});
}

//-----------------------------------------------------------------------------

/*
"in_progress", "interrupted", or "complete"
"FILE_FAILED", "FILE_ACCESS_DENIED", "FILE_NO_SPACE",
"FILE_NAME_TOO_LONG", "FILE_TOO_LARGE", "FILE_VIRUS_INFECTED",
"FILE_TRANSIENT_ERROR", "FILE_BLOCKED", "FILE_SECURITY_CHECK_FAILED",
"FILE_TOO_SHORT", "FILE_HASH_MISMATCH", "FILE_SAME_AS_SOURCE",
"NETWORK_FAILED", "NETWORK_TIMEOUT", "NETWORK_DISCONNECTED",
"NETWORK_SERVER_DOWN", "NETWORK_INVALID_REQUEST", 
"SERVER_FAILED", "SERVER_NO_RANGE", "SERVER_BAD_CONTENT",
"SERVER_UNAUTHORIZED", "SERVER_CERT_PROBLEM", "SERVER_FORBIDDEN",
"SERVER_UNREACHABLE", "SERVER_CONTENT_LENGTH_MISMATCH", "SERVER_CROSS_ORIGIN_REDIRECT",
"USER_CANCELED", "USER_SHUTDOWN", "CRASH"
*/

//-----------------------------------------------------------------------------

