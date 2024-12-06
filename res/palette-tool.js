/*global PaletteTool: true*/
/*global Color, Tool, storedCollection*/
PaletteTool =
(function () {
"use strict";

function PaletteTool (paletteInput) {
	this.init(document.getElementById('palette-tool'), paletteInput);
	this.modeHSL = document.getElementById('palette-tool-mode-hsl');
	this.modeOKLab = document.getElementById('palette-tool-mode-oklab');
	this.modeHSL.addEventListener('change', this.update.bind(this));
	this.modeOKLab.addEventListener('change', this.update.bind(this));
	this.selectInput = document.getElementById('palette-tool-select');
	this.selectInput.addEventListener('change', this.update.bind(this));
	this.output = document.getElementById('palette-tool-output');
	this.output.addEventListener('click', this.onClick.bind(this));
	this.buildSelect();
}

PaletteTool.prototype = new Tool();

PaletteTool.prototype.updateOnSelectionChange = true;

PaletteTool.prototype.buildSelect = function () {
	this.selectInput.innerHTML = '<option value="">(none)</option>' + storedCollection.getMore().map(function (data) {
		return '<option>' + data.label + '</option>';
	}).join('');
};

PaletteTool.prototype.update = function () {
	var index, palette, colors, label;
	index = this.paletteInput.selectedIndex;
	palette = this.paletteInput.getPalette();

	if (index > -1) {
		this.modeHSL.disabled = false;
		this.modeOKLab.disabled = false;
		this.selectInput.disabled = true;
		colors = palette.getColor(index).getSimilarColors(this.modeOKLab.checked);
	} else {
		this.modeHSL.disabled = true;
		this.modeOKLab.disabled = true;
		this.selectInput.disabled = false;
		colors = storedCollection.getCollections();
		label = this.selectInput.value;
		if (label) {
			colors.push({label: label, colors: storedCollection.getByLabel(label)});
		}
		colors.forEach(function (entry) {
			entry.colors = entry.colors.map(function (code) {
				return Color.fromHex(code);
			});
		});
	}

	colors = colors.map(function (block) {
		return {
			label: block.label,
			colors: block.colors.filter(function (color) {
				return !palette.contains(color);
			})
		};
	});
	colors = colors.filter(function (block) {
		return block.colors.length;
	});

	this.colors = [];
	this.output.innerHTML = colors.map(function (block) {
		return '<h3>' + block.label + '</h3><ul class="color-palette">' +
			block.colors.map(function (color) {
				var attr = [], i = this.colors.length;
				this.colors.push(color);
				attr.push('style="background-color:' + color.toString() + '"');
				attr.push('data-index="' + i + '"');
				attr.push('tab-index="0"');
				if (color.l >= 80) {
					attr.push('class="white"');
				}
				return '<li ' + attr.join(' ') + '></li>';
			}, this).join('') +
			'</ul>';
	}, this).join('');
};

PaletteTool.prototype.onClick = function (e) {
	var index = e.target.dataset.index;
	if (index) {
		this.paletteInput.addColor(this.colors[index]);
	}
};

return PaletteTool;
})();