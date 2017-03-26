// @dangolk		To copy all text blocks into one big structure

init();

function init() {		
	text = walkmore(document.body);
	console.log(text);
	httpPOST(text);
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
	console.log(textOnly);
	return textOnly;
}

function walk(node, textOnly, func)
{
	// Source: http://is.gd/mwZp7E

	var child, next;

	switch ( node.nodeType )
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child )
			{
				next = child.nextSibling;
				walk(child, textOnly, func);
				child = next;
			}
			break;

		case 3: // Text node
			//console.log(node.nodeValue)
			func(node, textOnly);
			break;
	}
}


function concatText(textNode, textOnly)
{	
	textOnly += " " + textNode.nodeValue;
}

function httpPOST(textOnly)
{	
	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
	xmlhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			var jsonResponse = JSON.parse(this.responseText)
			console.log(jsonResponse);
			chrome.runtime.sendMessage({score:jsonResponse});
		}
	}

	xmlhttp.open("POST", "https://localhost:5000/parse");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify({"text": textOnly, "url":"foo"}));		
}	