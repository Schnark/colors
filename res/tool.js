/*global Tool: true*/
Tool =
(function () {
"use strict";

function Tool () {
}

Tool.prototype.init = function (element, paletteInput) {
	this.element = element;
	this.paletteInput = paletteInput;
	this.active = false;
	this.element.className = 'tool inactive';
};

Tool.prototype.getHandle = function () {
	return this.element.querySelector('h2');
};

Tool.prototype.activate = function () {
	this.active = true;
	this.element.className = 'tool active';
	this.update();
};

Tool.prototype.deactivate = function () {
	this.active = false;
	this.element.className = 'tool inactive';
};

Tool.prototype.showModifiedPalette = function (ctx, modify) {
	var palette = this.paletteInput.getPalette();
	ctx.canvas.width = 10 * palette.getCount();
	ctx.canvas.height = 20;
	palette.forEach(function (color, i) {
		ctx.fillStyle = color.toString();
		ctx.fillRect(10 * i, 0, 10, 10);
		ctx.fillStyle = modify(color, i).toString();
		ctx.fillRect(10 * i, 10, 10, 10);
	});
};

Tool.prototype.buildTable = function (table, callback) {
	var palette, html = [];
	palette = this.paletteInput.getPalette();
	html.push('<tr><th>&nbsp;</th>');
	palette.forEach(function (color) {
		html.push('<th style="background-color:' + color.toString() + '"></th>');
	});
	html.push('</tr>');
	palette.forEach(function (color0, i) {
		html.push('<tr><th style="background-color:' + color0.toString() + '"></th>');
		palette.forEach(function (color1, j) {
			html.push(callback(color0, color1, i, j));
		});
		html.push('</tr>');
	});
	table.innerHTML = html.join('');
};

return Tool;
})();