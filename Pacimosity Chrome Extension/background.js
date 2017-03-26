chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	var badge_text = request.score.toString();
	console.log(badge_text);
	chrome.browserAction.setBadgeText({"text":badge_text});
	chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		var tab = tabs[0];
		var url = tab.url;
		//chrome.tabs.sendMessage(tabs[0].id, {score:0}, function (response){
		//url = response.url;1
		//console.log(response);
	//});
	if(request.score == -1){
		sendResponse({"url":url});
		console.log(url);
	}
	});
});
