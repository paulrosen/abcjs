function printPath(renderer, attrs, params) {
	var ret = renderer.paper.path(attrs);
	if (!params || !params.history)
		renderer.controller.recordHistory(ret);
	else if (params.history === 'not-selectable')
		renderer.controller.recordHistory(ret, true);

	if (renderer.doRegression) renderer.addToRegression(ret);
	return ret;
}

module.exports = printPath;
