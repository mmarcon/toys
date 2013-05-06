#BASE

BASE is a very simple HTML5 *boilerplate* with everything that is needed to get started with a web project or with a live coding session:

 * skeleton of an HTML5 document -` index.html`;
 * `reset.css`;
 * empty `style.css`;
 * empty `main.js`;

No libraries (e.g. jQuery) or plugins are included. If you need a library or a plugin in your project I would suggest to give [bower](http://bower.io/) a try.

BASE includes a very simple `Gruntfile` already configured for *livereload*. Just run `npm install` in the BASE root folder and everything will be setup for you.

Then just run:

	grunt server
	
A new browser window will open, pointing at `http://localhost:9000`.

As you change the code and save the files the browser will automatically reload the page and you will see your changes immediately.

## Getting BASE

To get BASE you can simply clone this repository, download it as a [zip file](https://github.com/mmarcon/base/archive/master.zip) or use the convenient `get-base` tool.

`get-base` is more of a personal tool, so I did not add it to the npm registry. However you can still install it with npm:

	sudo npm install -g git://github.com/mmarcon/base.git#get-base
	
At this point you will be able to do
	
	get-base [DESTINATION_FOLDER]
	
When `DESTINATION_FOLDER` is not specified BASE will be copied in a folder called `base`.

	
