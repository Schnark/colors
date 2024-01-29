/*global LoadTool: true*/
/*global Palette, Tool, storedCollection*/
LoadTool =
(function () {
"use strict";

//TODO allow user created palettes

function LoadTool (paletteInput) {
	this.init(document.getElementById('load-tool'), paletteInput);
	this.selectedPalette = new Palette();
	this.selectInput = document.getElementById('load-tool-select');
	this.ctx = document.getElementById('load-tool-canvas').getContext('2d');
	this.selectInput.addEventListener('change', this.onSelect.bind(this));
	document.getElementById('load-tool-use').addEventListener('click', this.onUse.bind(this));
	document.getElementById('load-tool-add').addEventListener('click', this.onAdd.bind(this));
	this.buildSelect();
	this.onSelect();
}

LoadTool.defaultPalettes = {
	Light: ['#ffffff', '#222222', '#72777d', '#9a373b', '#2b55ab'],
	Dark: ['#222222', '#c8ccd1', '#a2a9b1', '#db9c9e', '#91ade4'],
	Sepia: ['#f4ecd8', '#5b4636', '#676c71', '#883134', '#264b97']
};

LoadTool.prototype = new Tool();

LoadTool.prototype.update = function () {
};

LoadTool.prototype.buildSelect = function () {
	this.selectInput.innerHTML = storedCollection.getPalettes().map(function (data) {
		return '<option>' + data.label + '</option>';
	}).join('');
};

LoadTool.prototype.onSelect = function () {
	this.selectedPalette.fromHexList(storedCollection.getByLabel(this.selectInput.value));
	this.ctx.canvas.width = 10 * this.selectedPalette.getCount();
	this.ctx.canvas.height = 10;
	this.selectedPalette.forEach(function (color, i) {
		this.ctx.fillStyle = color.toString();
		this.ctx.fillRect(10 * i, 0, 10, 10);
	}.bind(this));
};

LoadTool.prototype.onUse = function () {
	this.paletteInput.setPalette(this.selectedPalette);
	this.selectedPalette = new Palette();
	this.onSelect();
};

LoadTool.prototype.onAdd = function () {
	var palette = this.paletteInput.getPalette();
	this.selectedPalette.forEach(function (color) {
		if (!palette.contains(color)) {
			palette.addColor(color);
		}
	});
	this.paletteInput.setPalette(palette);
};

return LoadTool;
})();