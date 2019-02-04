/**
 * @preserve Copyright (C) 2019 a.y.choi@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var contextPool = {}
var currentContext;
var allContext

var configurables = [];

var keyCodeToChar = {8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause/Break",20:"Caps Lock",27:"Esc",32:"Space",33:"Page Up",34:"Page Down",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"Windows",93:"Right Click",96:"Numpad 0",97:"Numpad 1",98:"Numpad 2",99:"Numpad 3",100:"Numpad 4",101:"Numpad 5",102:"Numpad 6",103:"Numpad 7",104:"Numpad 8",105:"Numpad 9",106:"Numpad *",107:"Numpad +",109:"Numpad -",110:"Numpad .",111:"Numpad /",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Num Lock",145:"Scroll Lock",182:"My Computer",183:"My Calculator",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};
var keyCharToCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause/Break":19,"Caps Lock":20,"Esc":27,"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"Windows":91,"Right Click":93,"Numpad 0":96,"Numpad 1":97,"Numpad 2":98,"Numpad 3":99,"Numpad 4":100,"Numpad 5":101,"Numpad 6":102,"Numpad 7":103,"Numpad 8":104,"Numpad 9":105,"Numpad *":106,"Numpad +":107,"Numpad -":109,"Numpad .":110,"Numpad /":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"Num Lock":144,"Scroll Lock":145,"My Computer":182,"My Calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};

function tinyKeyEvent(keyText,e){
	var charkeyCode = String.fromCharCode(e.keyCode); // ghetto budget way of doing it, I'll clean this up later..
	if (
		//	e.keyCode == 8 || // backspace
			e.keyCode == 9 || // tab
			e.keyCode == 13 || // enter
			e.keyCode == 16 || // shift
			e.keyCode == 17 || // ctrl
			e.keyCode == 18 || // alt
			e.keyCode == 20 || // caps lock
		//	e.keyCode == 27 || // esc
		//	e.keyCode == 32 || // space
			e.keyCode == 33 || // page up
			e.keyCode == 34 || // page down
			e.keyCode == 35 || // end
			e.keyCode == 36 || //home
		//	e.keyCode == 37 || // left
		//	e.keyCode == 38 || // up
		//	e.keyCode == 39 || // right
		//	e.keyCode == 40 || // down
			e.keyCode == 46 // delete
		){
		return null;
	}

	var out = keyText+" ";
	if (e.altKey){
		out += "ALT "
	}
	if (e.ctrlKey){
		out += "CTRL "
	}
	if (e.shiftKey){
		out += "SHIFT "
	}
	// keyCode :-(
	// http://unixpapa.com/js/key.html
	// http://www.w3.org/TR/DOM-Level-3-Events/#legacy-key-attributes
	// whatever works...
	out += keyCodeToChar[e.keyCode];
	//out += charkeyCode; //out += e.keyIdentifier;
	return out;
}


class UI {
	constructor(userInput, uiname="defaultUserInput", debug=false){
		this.e = document.createElement("DIV");
		var DIV = this.e
		var UI = this
		this.userInput = userInput
		this.e.id = uiname;

		var openMenu = function openMenu(){
			UI.e.classList.add("show");
			console.log('open', UI)
			UI.userInput.setContext("MENU");
		}

		var closeMenu = function closeMenu(){
			UI.e.classList.remove("show");
			console.log('close', UI)
			UI.userInput.setContext("ROOT");
		}

		userInput.createContext("MENU", "ROOT")
		userInput.keyDown("Esc", openMenu, {context:"NONE", configurable: false})
		userInput.keyDown("Esc", closeMenu, {context:"MENU", configurable: false})

		var closebutton = document.createElement("A");
		closebutton.classList.add("close");
		closebutton.addEventListener("click", closeMenu);
		this.e.appendChild(closebutton);

		this.ul = document.createElement("UL");
		this.e.appendChild(this.ul);
		var appendChild = function appendChild(){
			document.body.appendChild(DIV);
		}
		if (document.readyState === 'complete'){
			appendChild();
		} else {
			window.addEventListener("load", appendChild);
		}

	}

	addElement(button, opt, fn){
		var tempplaceholder;
		var input = document.createElement("INPUT");

		input.value = unescape(button).replace("KEYDOWN ","");

    	input.addEventListener("keydown",function(e){
    		var key = tinyKeyEvent("KEYDOWN",e);
    		if (key && (key != "KEYDOWN Esc")){
    			if (key == "KEYDOWN Backspace"){
    				input.value = "";
    			} else {console.log('key',key,unescape(key).replace("KEYDOWN ",""),e);
		    		input.value = unescape(key).replace("KEYDOWN ","");
    			}
					if (e.preventDefault) {
					    e.preventDefault();
					}
					e.returnValue = false;
    		}
    	},false);
	    input.onfocus = function(){
	    	tempplaceholder = input.value;
	    }
	    var saveInput = function(){
	    	if (!opt.context){
	    		throw "no context found!";
	    	}
	    	var parentContext = contextPool[opt.context];
	    	try{
				console.log('saving input o ',input.value,'from context',opt.context);
	    		var inputvalue = input.value;
		    	if (input.value == ""){
		    		inputvalue = "UNBOUND "+tempplaceholder
		    	}
		    	//console.log("inputvalue",inputvalue);
		    	parentContext.addEvent("KEYDOWN "+inputvalue,fn);
	    	} catch (e){
	    		console.error("Cannot bind "+input.value+" to "+fn.description)
	    		alert("event already bound "+e)
	    		input.value = tempplaceholder;
	    	}
	    }
	    input.addEventListener("keyup",saveInput);
	    input.onblur = saveInput;

		var li = document.createElement("LI");
		var txt= document.createTextNode(fn.description);
		li.appendChild(input);
		li.appendChild(txt);
		this.ul.appendChild(li);
	}
}


class ContextNode {
	constructor(name, parentContext){
		this.parent = parentContext;
		this.children = {};
		this.eventsList = {};
		this.name = name;

		if (this.parent){
			this.parent.addChild(this.name, this); // linking parent
		}
		if (!contextPool[name]){
			contextPool[name] = this; // simply linking a hash...
		} else {
			throw "duplicate name for context! "+name
		}
	}

	addChild(namespace, obj){
		if (obj instanceof ContextNode){
			this.children[namespace] = obj;
		} else {
			// wtf, should never get here... :-(
			throw "not a ContextNode!"
		}
	}

	getChild(namespace){
		return this.children[namespace];
	}

	getParent(){
		return this.parent;
	}

	addEvent(name, fn){
		let myfn;
		name = escape(name)
		var eventsListObj = this.eventsList;
		console.log(eventsListObj);
		for ( var eventnames in eventsListObj){
			myfn = eventsListObj[eventnames];
			if (fn == myfn){
				delete eventsListObj[eventnames]
			}
		}
		if (eventsListObj[name] && (eventsListObj[name] != fn)){
			throw eventsListObj[name].description
		}
		this.eventsList[name] = fn;
	}

	getEvent(name){
		var escName = escape(name)
		return this.eventsList[escName]
	}

	findEventNameByFunction(fn){
		var eventsListObj = this.eventsList;
		for (eventnames in eventsListObj){
			var myfn = eventsListObj[eventnames];
			if (fn == myfn){
				// ok, so if it finds something, lets return the event name
				return eventnames;
			}
		}
	}
}


class UserInput {
	constructor(uiname, debug=false){

		currentContext = this.createContext("ROOT")
		allContext = this.createContext("NONE")

		this.UI = new UI(this, uiname, debug);
		this.debug = {
			contextPool : contextPool,
			allContext : allContext,
			currentContext : currentContext
		}

		var processKeyDown = function processKeyDown(e){
			var key = tinyKeyEvent("KEYDOWN",e);
			if (key){
				var myfunction = currentContext.getEvent(key) || allContext.getEvent(key);
				if (myfunction){
					e.preventDefault();
					myfunction(e);
				}
			}
		};
		var processKeyUp = function processKeyUp(e){
			var key = tinyKeyEvent("KEYUP",e);
			if (key){
				var myfunction = currentContext.getEvent(key) || allContext.getEvent(key);
				if (myfunction){
					myfunction();
					e.preventDefault();
				}
			}
		}
		var processMouseWheel = function(e){
			var key = "MOUSEWHEEL"
			var myfunction = currentContext.getEvent(key) || allContext.getEvent(key);
			if (myfunction){
				myfunction(e);
				e.preventDefault();
			}
		}

		// okay, so since we kinda hijack the event listener here, this may not be popular..
		// but in the meaantime, leave it as is.
		window.addEventListener("keydown",processKeyDown, false);
		window.addEventListener("keyup",processKeyUp, false);
		window.addEventListener("mousewheel", processMouseWheel, false);
	}

	mouseWheel(fn, opt){
		// class method to register mousewheel events
		var contextName = "NONE";
		if (opt){
			contextName = opt.context || contextName;
			if (opt.textDefinition){
				Object.defineProperty(fn, "description", {value : opt.textDefinition, writable : false, enumerable : true, configurable : false});
				//console.log("Setting definition to this fn",fn,opt.textDefinition);
			}
		}
		contextName = contextName || "NONE"; // give it a generic ALL value if no context found
		var mycontext = contextPool[contextName];
		mycontext.addEvent("MOUSEWHEEL",fn);
	}

	_keyBind(button, fn, opt){
		// generic method to bind keys used for keyUp and keyDown
		var contextName = "NONE";
		if (opt){
			contextName = opt.context || contextName;
			if (opt.textDefinition){
				Object.defineProperty(fn, "description", {value : opt.textDefinition, writable : false, enumerable : true, configurable : false});
			}
			if (opt.configurable){
				this.UI.addElement(button,opt,fn);
			}
		} else {
			this.UI.addElement(button,opt,fn);
		}
		contextName = contextName || "NONE"; // give it a generic ALL value if no context found
		var mycontext = contextPool[contextName];
		mycontext.addEvent(button,fn);

	}

	keyDown(button, fn, opt){
		// method to register keydown events
		this._keyBind("KEYDOWN "+button,fn,opt);
	}

	keyUp(button, fn, opt){
		// method to register keyup events
		this._keyBind("KEYUP "+button,fn,opt);
	}

	createContext(name, parentName){
		// create a context for events to be registered under
		console.log('creating! ', name, parentName)
		if (contextPool[name]){
			throw "createContext ERROR: "+name+" already exists"
		}
		if (contextPool[parentName]){
			var parentContext = contextPool[parentName]
			return new ContextNode(name, parentContext)
		} else {
			return new ContextNode(name)
		}
	}

	setContext(name){
		// called to set the context
		if (!contextPool[name]){
			throw "setContext ERROR: "+name+" does not exist";
		}
		currentContext = contextPool[name];
	}

}

export { UserInput };