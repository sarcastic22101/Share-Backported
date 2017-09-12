var sb_id, sb_prev_url;
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'share-backid') {
	browser.windows.create(request.data).then(function (tab) {
	  sb_id = tab.id;
	  sb_prev_url = request.data.url;
	  return tab.id;
	});
  }
});

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (sb_id === tab.windowId) {
	if (sb_prev_url.indexOf('https://www.linkedin.com/shareArticle') >= 0 || sb_prev_url.indexOf('https://plus.google.com/share') >= 0 || sb_prev_url.indexOf('https://reddit.com/') >= 0) {
	  browser.tabs.insertCSS(tabId, {code: "body { overflow: auto !important; }"});
	}
	browser.tabs.get(tabId, function (tabinfo) {
	  if (sb_prev_url !== tabinfo.url) {
		var close = false;
		if (tabinfo.url.indexOf('dialog/return/close#_=_') > 0 || tabinfo.url.indexOf('latest_status_id=') > 0 || tabinfo.url === 'https://plus.google.com/') {
		  close = true;
		}
		if (close === true) {
		  browser.tabs.remove(tabId);
		}
	  }
	});
  }
});