var plugins = []

function registerPlugin(plugin) {
	// TODO-PER: need to make sure there aren't duplicates
	plugins.push(plugin)
}

function pluginEvent(type, data) {
	for (var i = 0; i < plugins.length; i++)
		data = plugins[i](type, data)
	return data;
}

module.exports = { registerPlugin: registerPlugin, pluginEvent: pluginEvent }
