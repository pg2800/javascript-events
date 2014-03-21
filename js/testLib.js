//-------------------------
// Created: Dic-2013 - Pablo Ivan Garcia Camou
// Simulates testing in javascript.
//-------------------------

//To display in the browser, create a unsorted list: ul#asserts
//object that holds the functions of this library
var testLib = {};


(function(){
	
	try{
		document.querySelector("ul#asserts");
	} catch (e){
		testLib.log("Your browser's version was not considered for library TestLib.js");
		return "Your browser's version was not considered for library TestLib.js";
	};

	//this adds the needed css for the tests, to display the results in a better way.
	//if there is not any unsortered list with the id of "asserts" then it does not add the CSS to the site
	window.onload = function addCssForTests(css){
		if(!document.querySelector("ul#asserts")) return;
		var head = document.getElementsByTagName("head")[0];
		var s = document.createElement("style");
		s.setAttribute("type", "text/css");
		s.innerHTML="#asserts li.pass {color:green;} \n#asserts li.fail {color:red;}";
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = css;
	  } else {                // the world
	  	s.appendChild(document.createTextNode(css));
	  }
	  head.appendChild(s);
	};

	//this method tests the function sent for performance
	testLib.performance = function(times, fn){
		var start = new Date().getTime();
		var binded_fn = fn.bind(fn);
		for(var i=0; i<times; i++){
			binded_fn();
		}
		var end = new Date().getTime();
		return end - start;
	};

	//this test the assert and adds the id to the list item element created
	//if there is not a list tu add the element it prints it in the console log
	testLib.assert = function (booleanTest, description){
		var test = booleanTest ? "pass" : "fail";
		var list = document.querySelector("ul#asserts");
		var li = document.createElement("li");

		li.className = test;
		li.appendChild(document.createTextNode(description));
		if( testLib.results ){
			testLib.results.appendChild(li);
			if (!booleanTest) {
				li.parentNode.parentNode.className = "fail";
			}
			return li;
		};

		if( list ){
			list.appendChild(li);
			return li;
		};

		var msg = test + ": " + description;
		testLib.log( msg );
		return msg;
	};

	//returns a function that receives a name and a function that holds several asserts.
	testLib.test = function (testName, fn){
		testLib.results = document.querySelector("ul#asserts");
		if(testLib.results)
			testLib.results = testLib.assert(true, testName).appendChild(document.createElement("ul"));
		fn();
	};

	//test asynchronous stuff synchronously
	// testLib.asyncTests.queue = [];
	// testLib.asyncTests.paused = false;
	// testLib.asyncTests.add = function(fn){
	// 	testLib.asyncTests.queue.push(fn);
	// }; 
	// testLib.asyncTests.pause = function(){ 
	// 	testLib.asyncTests.paused = true;
	// };
	// testLib.asyncTests.resume = function(){
	// 	testLib.asyncTests.paused = false;
	// 	setTimeout(testLib.asyncTests.runTests, 1);
	// };
	// testLib.asyncTests.runTests = function(){
	// 	if(!testLib.asyncTests.paused $$ testLib.asyncTests.queue.length){
	// 		testLib.asyncTests.queue.shift()();
	// 		if(!testLib.asyncTests.paused) testLib.asyncTests.resume();
	// 	};
	// };

	//prints to the console
	testLib.log = function(){
		try { // for the world (including IE)
			console.log.apply(console, arguments);
		}
		catch(e) {
			try { //for opera
				opera.postError.apply(opera, arguments);
			}
			catch(e){ //just a fallback
				alert(Array.prototype.join.call(arguments));
			}
		}
	};	
}());
