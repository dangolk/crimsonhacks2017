// @dangolk		To copy all text blocks into one big structure
url = ""
/*chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	url = request.url;
	console.log(request);
	sendResponse();
});*/

init();

function init() {	
	chrome.runtime.sendMessage({score:-1}, function (response){
		//url = response.url;
		console.log(response);
	});
	var text = walkmore(document.body);
	console.log(text);	
	httpPOST(text, url);
	console.log("Data sent to server ! ");
}

function walkmore(node){
	var n, textOnly = "", walk=document.createTreeWalker(
		node,
		NodeFilter.SHOW_TEXT, 
		{acceptNode: function(node){
			if(!/\n+/.test(node.data)){
				return NodeFilter.FILTER_ACCEPT;
			}
			}},
		false
	);
	while(n=walk.nextNode()) textOnly += (n.data);
	return textOnly;
}

function httpPOST(textOnly, url)
{	
	url = url;
	console.log(url);
	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
	xmlhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var jsonResponse = JSON.parse(this.responseText)
			console.log(jsonResponse);
			chrome.runtime.sendMessage({score:jsonResponse}, function (response){

			});
		}
	}


	xmlhttp.open("POST", "https://localhost:5000/parse");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify({"text": textOnly, "url":url}));		
}	