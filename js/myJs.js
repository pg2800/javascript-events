(function events(){

	(function(){
		var rgbRegEx = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i,
		rgbaRegEx = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(.*)\)$/i;
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		window.rgb2hex = function (color) {
			if(!(color = color.match(rgbRegEx) || color.match(rgbaRegEx))) return;
			var ret = "#" + hex(color[1]) + hex(color[2]) + hex(color[3]);
			return ret;
		}
	})();

	var addDivButton = document.getElementById("addDivButton"),
	divs = {},
	maxSquares = 10,
	editing = undefined,
	insideModifyingArea = false,
	bgColorElement = document.getElementById("backgroundColor"),
	bColorElement = document.getElementById("borderColor"),
	bThicknessElement = document.getElementById("borderThickness"),
	rEdgesElement = document.getElementById("roundedEdges"),
	nonDigitRegEx = /\D/g;

	divs.next = 0;
	divs.init = document.getElementById("init");
	divs.mod = document.getElementById("mod");

	addEvent(addDivButton, "click", function (e){
		if(divs.next >= maxSquares) return;

		var id = divs.next++,
		div = divs[id] = document.createElement("div");

		div.setAttribute("class", "div");
		div.setAttribute("id", id);
		div.appendChild(document.createTextNode(""+id));

		addEvent(div, "mousedown", function (e){
			div.style.position = "absolute";
			var re = addEvent(document, "mouseup", removeEvents);
			var rm = addEvent(document, "mousemove", function (e){
				fixPageXY(e);
				var x = e.pageX, y = e.pageY,
				mod = divs.mod.getBoundingClientRect();

				div.style.left = x-45+"px";
				div.style.top = y-45+"px";
				insideModifyingArea = (x<=mod.right && x>=mod.left && y>=mod.top && y<=mod.bottom)? true : false;
			});
			function getDigitsFrom(v){
				return v? Number(v.replace(nonDigitRegEx, "")) : undefined;
			}
			function removeEvents(e){
				if(!insideModifyingArea){
					if(editing == div) editing = undefined;
					div.parentNode.removeChild(div);
					divs.init.appendChild(div);
				} else {
					if(editing) {
						editing.parentNode.removeChild(editing);
						divs.init.appendChild(editing);
						editing = undefined;
					}
					divs.mod.appendChild(div);
					editing = div;
					bgColorElement.value = rgb2hex(getComputedStylePropertyValue(div, "background-color"));
					bColorElement.value = rgb2hex(getComputedStylePropertyValue(div, "border-color"));
					bThicknessElement.value = getDigitsFrom(getComputedStylePropertyValue(div, "border-width")) * 10;
					rEdgesElement.value = getDigitsFrom(getComputedStylePropertyValue(div, "border-radius")) * 5;
				}
				div.style.position = "";
				removeEvent(document, "mousemove", rm);
				removeEvent(document, "mouseup", re);
			}
			// for compatibility issues with <IE8
			div.ondragstart = function() { return false };
		});
		//
		document.getElementById("init").appendChild(div);
	});

	//
	addEvent(bgColorElement, "change", function (e){
		if(!editing) return;
		editing.style.backgroundColor = bgColorElement.value;
	});
	addEvent(bColorElement, "change", function (e){
		if(!editing) return;
		editing.style.borderColor = bColorElement.value;
	});
	addEvent(bThicknessElement, "change", function (e){
		if(!editing) return;
		var s = editing.style,
		val = Math.floor(bThicknessElement.value/10) + "px solid " + editing.style.borderColor;
		s.borderBottom = s.borderTop = s.borderRight = s.borderLeft = val;
	});
	addEvent(rEdgesElement, "change", function (e){
		if(!editing) return;
		editing.style.borderRadius = Math.floor(rEdgesElement.value/5) + "px";
	});

	function fixPageXY(e) {
		if (e.pageX == null && e.clientX != null ) { 
			var html = document.documentElement
			var body = document.body

			e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0)
			e.pageX -= html.clientLeft || 0

			e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0)
			e.pageY -= html.clientTop || 0
		}
	};

})();