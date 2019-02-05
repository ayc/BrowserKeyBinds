## BrowserKeyBinds
a crude to add configurable keybindings on the browser


### Markdown

```javascript
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

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
