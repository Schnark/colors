/*global CodeTool: true*/
/*global Tool*/
CodeTool =
(function () {
"use strict";

function CodeTool (paletteInput) {
	this.init(document.getElementById('code-tool'), paletteInput);
	this.output = document.getElementById('code-tool-output');
}

CodeTool.prototype = new Tool();

CodeTool.prototype.updateOnSelectionChange = true;

CodeTool.prototype.update = function () {
	var data, index, palette;
	index = this.paletteInput.selectedIndex;
	palette = this.paletteInput.getPalette();
	if (index > -1) {
		data = palette.getColor(index).toStrings();
	} else {
		data = [];
		palette.forEach(function (color) {
			data.push(color.toString());
		});
	}
	this.output.innerHTML = data.map(function (code) {
		return '<li><code>' + code + '</code></li>';
	}).join('');
};

return CodeTool;
})();