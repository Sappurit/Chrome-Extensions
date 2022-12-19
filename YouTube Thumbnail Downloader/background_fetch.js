
//-----------------------------------------------------------------------------

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

	async function downloadThumbnail()
	{
		for (i = 0; i <= 3; i++)
		{
			var url      = `https://img.youtube.com/vi/${videoId}/${thumbnails[i]}.jpg`;
			var filename = `${title} (${thumbnails[i]}).jpg`;
			var response = await fetch(url, { method: 'HEAD' });

			console.log(url);
			console.log(filename);
			console.log(response.status);	//HTTP status code is 100–599
			console.log(response.ok);	//true if HTTP status code is 200-299

			if (response.status === 200) 
			{
				try { chrome.downloads.download({ url: url, filename: filename, saveAs: true }); }
				catch (error) { alert(error); }
				finally { return; }
			}
		}
	}

	downloadThumbnail();
});

//-----------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------

