var synthInstance : any;

function synthObject(options? : any) {
	if (options)
		synthInstance = {
			el: options.el,
			cursorControl: options.cursorControl,
			options: options
		}
	return synthInstance;
}

module.exports = synthObject
