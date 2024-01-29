/*global ModifyTool: true*/
/*global Tool, Palette*/
ModifyTool =
(function () {
"use strict";

function ModifyTool (paletteInput) {
	var prevType;
	this.init(document.getElementById('modify-tool'), paletteInput);
	this.typeSelect = document.getElementById('modify-select');
	prevType = this.typeSelect.value;
	this.valueRange = document.getElementById('modify-value');
	this.onlySelected = document.getElementById('modify-only-selected');
	this.applyButton = document.getElementById('modify-apply');
	this.ctx = document.getElementById('modify-canvas').getContext('2d');
	this.typeSelect.addEventListener('change', function () {
		var curType = this.typeSelect.value;
		if (curType !== prevType + '-oklab' && prevType !== curType + '-oklab') {
			this.valueRange.value = 0;
		}
		prevType = curType;
		this.update();
	}.bind(this));
	this.valueRange.addEventListener('input', this.update.bind(this));
	this.onlySelected.addEventListener('change', this.update.bind(this));
	this.applyButton.addEventListener('click', this.applyChanges.bind(this));
}

ModifyTool.prototype = new Tool();

ModifyTool.prototype.updateOnSelectionChange = true;

ModifyTool.prototype.update = function () {
	var type = this.typeSelect.value,
		value = Number(this.valueRange.value),
		selectedIndex = this.paletteInput.selectedIndex;
	if (selectedIndex === -1) {
		this.onlySelected.disabled = true;
	} else {
		this.onlySelected.disabled = false;
		if (!this.onlySelected.checked) {
			selectedIndex = -1;
		}
	}
	if (isNaN(value)) {
		return;
	}
	this.showModifiedPalette(this.ctx, function (color, i) {
		if (selectedIndex !== -1 && selectedIndex !== i) {
			return color;
		}
		return color.getModifiedColor(type, value);
	});
};

ModifyTool.prototype.applyChanges = function () {
	var newPalette = new Palette(),
		oldPalette = this.paletteInput.getPalette(),
		type = this.typeSelect.value,
		value = Number(this.valueRange.value),
		selectedIndex = this.onlySelected.checked ? this.paletteInput.selectedIndex : -1;
	if (isNaN(value)) {
		return;
	}
	oldPalette.forEach(function (color, i) {
		if (selectedIndex !== -1 && selectedIndex !== i) {
			newPalette.addColor(color);
		} else {
			newPalette.addColor(color.getModifiedColor(type, value));
		}
	});
	this.valueRange.value = 0;
	this.paletteInput.setPalette(newPalette);
};

return ModifyTool;
})();