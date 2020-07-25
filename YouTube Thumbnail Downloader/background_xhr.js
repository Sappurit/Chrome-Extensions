chrome.browserAction.onClicked.addListener(function(tab)
{
	if (! tab.url.includes('youtube.com/watch?v='))
	{
		alert('You must stay on YouTube video page.\nE.g. https://www.youtube.com/watch?v=kJQP7kiw5Fk');
		return;
	}

	var videoId    = tab.url.split(/=|&/)[1];
	var title      = tab.title.replace(/ - YouTube$/, '').replace(/[<>:"/\\|?*\x00-\x1F\u200b]/g, '').replace(/ {2,}/g, ' ');
	var thumbnails = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];	//1280x720, 640x480, 480x360, 320x180

	console.log(videoId);
	console.log(title);

	function checkThumbnail(url)
	{
		return new Promise(function(resolve, reject)
		{
			var xhr = new XMLHttpRequest();
			xhr.open('HEAD', url);
			xhr.send();

			xhr.onload = function()
			{
				console.log(`${xhr.status} : ${xhr.statusText} : ${url}`);	//On HTTP 2.0 does not have reason phrases (status line)
				if (xhr.status === 200) resolve(200);
				if (xhr.status === 404) reject(404);
			};

		});
	}

	async function downloadThumbnail()
	{
		for (i = 0; i <= 3; i++)
		{
			var url      = `https://img.youtube.com/vi/${videoId}/${thumbnails[i]}.jpg`;
			var filename = `${title} (${thumbnails[i]}).jpg`;
			var statusId = await checkThumbnail(url);

			console.log(url);
			console.log(filename);
			console.log(statusId);

			if (statusId === 200)
			{
				try { chrome.downloads.download({ url: url, filename: filename, saveAs: true }); }
				catch (error) { alert(error); }
				finally { return; }
			}
		}
	}

	downloadThumbnail();
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab)
{
	if (changeInfo.url === undefined) return;

	if (changeInfo.url.includes('youtube.com/watch?v='))
	{
	        chrome.browserAction.setIcon({path: 'images/icon_128.png', tabId: tabId});
	}
	else
	{
	        chrome.browserAction.setIcon({path: 'images/icon_disabled_128.png', tabId: tabId});
	}
});
