# BrowserKeyBinds
a crude to add configurable keybindings on the browser

```
import { UserInput } from "./userinput.js"

var userInput = new UserInput("mainmenu")

var myalert = function(){
	alert('I am an alert!')
}

var scrollmove = function scrollmove(e){
	console.log('scrollmove', e)
}

userInput.mouseWheel(scrollmove,{context:"ROOT"});
userInput.keyDown("A", myalert, {
	context: "ROOT",
	configurable: true,
	textDefinition: "test alert with button A"
})

console.log(userInput);
```
