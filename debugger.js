//const xpcom = require("xpcom");
//var {Cc,Cu,Ci} = require("chrome");
//const xpcom = require("xpcom");
const {Cc,Cu,Ci} = require("chrome");
const { Class } =require("sdk/core/heritage");
//Cu.import("resource://gre/modules/XPCOMUtils.jsm");
//try{
var jsd = Cc["@mozilla.org/js/jsd/debugger-service;1"].getService(Ci.jsdIDebuggerService);
var ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);

//console.log("hello before calling 2 ODA()");
jsd.asyncOn(oDA);
function oDA()
{
//console.log("hello");
jsd.scriptHook = myHook;
jsd.functionHook = myHook;
jsd.topLevelHook = myHook;
jsd.breakpointHook = myHook;
}


var myHook =
{
onScriptCreated: function(script){
//console.log("jkdhj");

},
onScriptDestroyed: function(script){},
onCall:function(frame,type)
{
//console.log("FileURI ::",type);	
  if (type == Ci.jsdICallHook.TYPE_TOPLEVEL_START){

printTopLevelScript(frame.script, true);
	    }
	    else if(type == Ci.jsdICallHook.TYPE_TOPLEVEL_END) {
          // End of TopLevel Script Evaluation
          printTopLevelScript(frame.script, false);
	    }
},

onExecute: function (frame, type, val) {
        // if(type == Components.interfaces.jsdIExecutionHook.TYPE_INTERRUPTED) {
        //     if(frame.script.fileName.indexOf("http") == 0)
        //         dump("\n Type_Interrupted\n ");
        // }
    
        if(type == Ci.jsdIExecutionHook.TYPE_BREAKPOINT) {
            if(frame.script.fileName.indexOf("http") == 0) {
                console.log("\n **************************************Type_Breakpoint: Pc = " + frame.pc +" Line=" + frame.line);
                frame.script.clearBreakpoint(frame.pc);
                return Ci.jsdIExecutionHook.RETURN_CONTINUE;
            }           
        }
    

  }
}

function printTopLevelScript(script, start)
{
   var fileURI = script.fileName;
    if(fileURI.indexOf("http") == 0){ // 0 means match, i.e, print only http scripts
	try
	    {
		// Debugger service messes up file:/ URLs, try to fix them
		fileURI = ioService.newURI(fileURI, null, null).spec;
	    } catch(e) {}

  if (start) {
      var endLineNo = script.baseLineNumber + script.lineExtent;
     
 console.log("\n -----------------------------------" +fileURI + " \nStart Line No:" + script.baseLineNumber + "  End Line No:" + endLineNo + "  Max Recurrsion:" + script.maxRecurseDepth + "  Call Count:" + script.callCount + "\njsdiCallHook:TYPE_TOPLEVEL_START:\n" + script.functionSource + "base line no:"+script.baseLineNumber);

console.log("End-line NO:",endLineNo);
      // Enable profiling of data
      script.flags |= Ci.jsdIScript.FLAG_PROFILE;


  // Dump executable lines: Does not work
  // var execLines = script.getExecutableLines(Components.interfaces.jsdIScript.PCMAP_SOURCETEXT, script.baseLineNumber, (script.baseLineNumber+script.lineExtent));
  // dump("\n\n Executable lines are as follows: \n" + execLines.toSource());

  // Set a breakpoint on a script: Each excutable line
  // Map each line to a PC, and collect that set of PCs (removing duplicates)
  var pcs = {};
  for (i = 0; i < script.lineExtent; i++) {
      var jsdLine = script.baseLineNumber + i;
      var pc = script.lineToPc(jsdLine, Ci.jsdIScript.PCMAP_SOURCETEXT);
      pcs[pc] = 1;
  }
  // Set a breakpoint on each of those PCs.
  for (pc in pcs) {
      try {
          script.setBreakpoint(pc);
      } catch(e) {
        //  console.log("\n Error setting breakpoit: " + e);
      }
  }

  } // end of IF(start) Loop
  else {
      //console.log("\n" + fileURI + "  Line No:" + script.baseLineNumber + "\njsdiCallHook:TYPE_TOPLEVEL_END:\n");  
  }
 } // end of http IF loop

} // end of printTopLevelScript() function
