/*global ColorblindnessTool: true*/
/*global Tool*/
ColorblindnessTool =
(function () {
"use strict";

function ColorblindnessTool (paletteInput) {
	this.init(document.getElementById('colorblindness-tool'), paletteInput);
	this.typeSelect = document.getElementById('colorblindness-select');
	this.ctx = document.getElementById('colorblindness-canvas').getContext('2d');
	this.typeSelect.addEventListener('change', this.update.bind(this));
}

ColorblindnessTool.prototype = new Tool();

ColorblindnessTool.prototype.update = function () {
	var type = this.typeSelect.value;
	this.showModifiedPalette(this.ctx, function (color) {
		return color.simulateColorBlindness(type);
	});
};

return ColorblindnessTool;
})();