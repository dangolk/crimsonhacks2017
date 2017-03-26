chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	badge_text = request.score.toString();
	console.log(badge_text);
	chrome.browserAction.setBadgeText({"text":badge_text});

	sendResponse();
});
