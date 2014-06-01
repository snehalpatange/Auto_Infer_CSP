self.port.on("extractContent", function(){
	var m  = new Map();
	m.set('onclick','click'	);
	m.set('ondblclick','dblclick'	);
	m.set('onmousedown','mousedown');
	m.set('onmousemove','mousemove');
	m.set('onmouseout','mouseout');
	m.set('onmouseover','mouseover');
	m.set('onmouseup','mouseup'	);
	var scriptText = '';
	scriptText = scriptText + "document.addEventListener(\"DOMContentLoaded\",registerListeners(),false);\n";
	scriptText = scriptText + "function registerListeners(){\n\n";
    var nodes = document.getElementsByTagName("input");
	//  console.log("l1" + nodes.length);
	var first = true;
	for (var i=0;i<nodes.length;i++) {
		var node = nodes[i];
		//console.log("node" + node);
		var attributes = node.attributes;
		//console.log("attr: " + attributes);
		var eventToRegisterFor = null;
		var id = null;
		var functionn = null;
		for (var j=0;j<attributes.length;j++) {
			var attribute = attributes.item(j)
			//console.log("attr: " + attribute + ", " + attribute.nodeName + ", " + attribute.value);
			if(m.has(attribute.nodeName)){
				eventToRegisterFor = attribute.nodeName;
				functionn = attribute.value;
			}
			if(attribute.nodeName === "id"){
				id = attribute.value;
			}
		}
		if(eventToRegisterFor!=null && id != null){
			if(first){
				scriptText = scriptText + "var ";
				first = false;
			}
			scriptText = scriptText + "e=document.getElementById(\""+ id + "\");\n";
			scriptText = scriptText + "e.addEventListener(\""+m.get(eventToRegisterFor)+"\","+functionn+",false);\n\n";
		}
	 }
	scriptText = scriptText + "}";

	var pageText = document.documentElement.innerHTML;
	currentSearchText = pageText.toLowerCase();
	var searching = 1;
	var scriptStart = '<script';
	var scriptEnd = '<\/script\>';
	var currentMarker = 0;
	while( searching == 1){
		var start = currentSearchText.indexOf(scriptStart);
		var end = currentSearchText.indexOf(scriptEnd);
		if(start>= 0  && end>=0){
			var scriptStr = pageText.substring(start + currentMarker + scriptStart.length+2, end + currentMarker)
			scriptText = scriptText +"\n" + scriptStr;
			console.log(scriptStr);
			currentMarker = currentMarker + end + scriptEnd.length; 
			currentSearchText = currentSearchText.substr(end + scriptEnd.length); 
		}else{
			searching = 0;	
		}
	}
	console.log("Page Code: \n" + pageText);
	console.log("Extracted Inline Java Script from page " + scriptText);
	self.port.emit("saveScript", [scriptText]);	
});

self.port.on("replaceJavaScript", function(message) {
	var m  = new Map();
	m.set('onclick','click'	);
	m.set('ondblclick','dblclick'	);
	m.set('onmousedown','mousedown');
	m.set('onmousemove','mousemove');
	m.set('onmouseout','mouseout');
	m.set('onmouseover','mouseover');
	m.set('onmouseup','mouseup'	);
  var scripts = document.getElementsByTagName("script");
  for (var i=0;i<scripts.length;i++) {
	var nod = scripts[i];
	nod.type= 'text/javascript';
	nod.src = 'file:///' + message;
	nod.innerHTML="";
  }
  var nodes = document.getElementsByTagName("input");
//  console.log("l1" + nodes.length);
  for (var i=0;i<nodes.length;i++) {
	var node = nodes[i];
	//console.log("node" + node);
	var attributes = node.attributes;
	//console.log("attr: " + attributes);
	var nodetoremove;
	var hasId = 0;
	for (var j=0;j<attributes.length;j++) {
		var attribute = attributes.item(j)
		//console.log("attr: " + attribute + ", " + attribute.nodeName + ", " + attribute.value);
		if(m.has(attribute.nodeName)){
			nodetoremove = attribute.nodeName;
		}
		if(attribute.nodeName === "id"){
			hasId = 1;
		}
	}
	if(nodetoremove!=null && hasId == 1){
		attributes.removeNamedItem(nodetoremove);
	}
  }
});
