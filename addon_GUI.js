var data = require("self").data;
var panel = require("sdk/panel").Panel({
  //contentURL: "about:blank",
   width:500,
   hight:500,
   contentURL: data.url("hi.html"),
  
}); 

var panel1 = require("sdk/panel").Panel({
 // contentURL: "about:blank",
   width:1000,
   hight:500,
   //contentURL: data.url("hi.html"),
  
});

var tabs = require("sdk/tabs");
//tabs.open("http://www.example.com");
var tabs = require('sdk/tabs');
 var vari=[];
/*for each(var tab in tabs)
console.log(tab.title);
*/

tabs.on('ready', function(tab) {
vari[tabs.length]=tab.url;
  //console.log('tab is loaded', tabs.length, vari[tabs.length]);
});

/*tabs.on('ready', function () {
for(var i=0;i<=tabs.length;i++)
 {  vari=URL(tabs[0].url).scheme;
  console.log('first: ' + vari);}
  console.log('last: ' + tabs[tabs.length-1].title);
});

*/
require("sdk/widget").Widget({
  id: "bing",
  label: "Bing",
  contentURL: "http://www.bing.com/favicon.ico",
  panel: panel1
 
});
	
var ss = require("sdk/simple-storage");
ss.storage.value=1;
ss.storage.array1=[10];
ss.storage.myObject = { a: "foo", b: { c: true }, d: null };
ss.storage.myArray = [0, "fool", "nhchj2", 3, 5, 8, 13];
//console.log("-------------------------"+ss.storage.myObject);
//console.log(ss.storage.value);
console.log("---------------------");

for(var i=0; i <vari.length; i++)
console.log(vari[i]+vari.length);



require("sdk/widget").Widget({
  id: "google",
  label: "Google",
  width:50,
  contentURL: "http://www.google.com/favicon.ico",
  panel: panel,
//onLoad: 
  onClick: function(){
panel.port.emit("add_to_drop_down_list",vari);
for(var i=0; i <10; i++)
{
ss.storage.array1[i]=new Array(3);
}
ss.storage.array1[1]=new Array(3);
ss.storage.array1[0][0]=2;
ss.storage.array1[0][1]=3;
ss.storage.array1[1][0]=3;
ss.storage.array1[2][0]=20;
ss.storage.array1[2][1]=21;
ss.storage.array1[2][2]=22;
ss.storage.array1[1][1]=3;
for (var i=0;i<3;i++)
{
for(var j=0;j<3;j++)
console.log(ss.storage.array1[i][j]);
}
//console.log(ss.storage.myObject[1]);
//console.log("Array :---" +ss.storage.myArray);  
//delete ss.storage.value;
//console.log("Hiii");
//ss.storage.array1[0][0]={ 2 };
//console.log(ss.storage.array1);
//ss.storage.myArray[7]="gfhj";
//console.log(ss.storage.myArray);
//ss.storage.array1[0][1]=3;
//console.log("2-Dimentional array : " + ss.storage.array1[0][0]);
//console.log("After Delete Operation " +ss.storage.value);
//console.log("array's 2nd value is "+ss.storage.myArray[2]);  
//for (var i=1;i<=tabs.length;i++)
//console.log(vari[i]+vari.length);
}
  
});

panel.port.on("exit", function () {
  console.log("Panel is Closing ");
  panel.hide();
});

