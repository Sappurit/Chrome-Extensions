chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
		if (tabs[0].url.indexOf("youtube.com/watch?v=") == -1) {
			alert('You must stay on YouTube video page.\nE.g. https://www.youtube.com/watch?v=kJQP7kiw5Fk');
		} else {
			let youTubeId = tabs[0].url.split(/=|&/)[1];
			let url1 = "https://img.youtube.com/vi/" + youTubeId + "/maxresdefault.jpg";
			let url2 = "https://img.youtube.com/vi/" + youTubeId + "/hqdefault.jpg";

			chrome.downloads.download({ url: url1, filename: youTubeId + ".jpg", saveAs: true }, function(downloadId) {
	                        if (typeof downloadId === 'number') { return; }
				chrome.downloads.download({ url: url2, filename: youTubeId + ".jpg", saveAs: true });
			});
                }
	});
});
