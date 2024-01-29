/*global Palette: true*/
/*global Color*/
Palette =
(function () {
"use strict";

function Palette () {
	this.colors = [];
}

Palette.prototype.addColor = function (color) {
	this.colors.push(color);
};

Palette.prototype.setPalette = function (colors) {
	this.colors = colors;
};

Palette.prototype.fromHexList = function (list) {
	this.colors = list.map(function (code) {
		return Color.fromHex(code);
	});
};

Palette.prototype.updateColor = function (color, index) {
	this.colors[index] = color;
};

Palette.prototype.removeColor = function (index) {
	this.colors.splice(index, 1);
};

Palette.prototype.contains = function (color) {
	var i;
	color = color.toString();
	for (i = 0; i < this.colors.length; i++) {
		if (this.colors[i].toString() === color) {
			return true;
		}
	}
	return false;
};

Palette.prototype.getCount = function () {
	return this.colors.length;
};

Palette.prototype.getColor = function (index) {
	return this.colors[index].clone();
};

Palette.prototype.forEach = function (callback) {
	var i;
	for (i = 0; i < this.colors.length; i++) {
		callback(this.colors[i].clone(), i);
	}
};

return Palette;
})();
