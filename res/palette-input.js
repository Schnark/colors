/*global PaletteInput: true*/
/*global Palette, util*/
/*global Event*/
PaletteInput =
(function () {
"use strict";

function PaletteInput (colorInput) {
	this.colorInput = colorInput;
	this.palette = new Palette();
	this.palette.addColor(colorInput.getColor());
	this.selectedIndex = 0;
	this.display = document.getElementById('palette-input-display');
	this.addButton = document.getElementById('palette-input-add');
	this.deleteButton = document.getElementById('palette-input-delete');
	this.display.addEventListener('click', function (e) {
		var index = e.target.dataset.index;
		if (index) {
			this.onColorClick(Number(index));
		} else {
			this.onColorClick(-1);
		}
	}.bind(this));
	this.addButton.addEventListener('click', this.onAddClick.bind(this));
	this.deleteButton.addEventListener('click', this.onDeleteClick.bind(this));
	this.colorInput.addEventListener('change', this.onColorChange.bind(this));
	this.updateButtons();
	this.updateDisplay();
}

util.mixinEventTarget(PaletteInput);

PaletteInput.prototype.addColor = function (color) {
	this.palette.addColor(color);
	this.updateButtons();
	this.updateDisplay();
	this.triggerPaletteChange();
};

PaletteInput.prototype.setPalette = function (palette) {
	this.palette = palette;
	if (this.selectedIndex >= this.palette.getCount()) {
		this.selectedIndex = -1;
	} else if (this.selectedIndex > -1) {
		this.ignoreColorChange = true;
		this.colorInput.setColor(this.palette.getColor(this.selectedIndex));
	}
	this.updateButtons();
	this.updateDisplay();
	this.triggerPaletteChange();
};

PaletteInput.prototype.getPalette = function () {
	return this.palette;
};

PaletteInput.prototype.updateButtons = function () {
	this.addButton.style.display = this.selectedIndex === -1 ? '' : 'none';
	this.deleteButton.style.display = this.selectedIndex === -1 ? 'none' : '';
	this.addButton.disabled = this.palette.contains(this.colorInput.getColor());
	this.deleteButton.disabled = this.palette.getCount() <= 1;
};

PaletteInput.prototype.updateDisplay = function () {
	var html = [];
	this.palette.forEach(function (color, i) {
		var attr = [];
		if (this.selectedIndex === i) {
			if ((color.h > 200 && color.h < 270) && color.s > 40 && (color.l > 20 && color.l < 80)) {
				attr.push('class="selected not-blue"');
			} else {
				attr.push('class="selected"');
			}
		} else if (color.l >= 80) {
			attr.push('class="white"');
		}
		attr.push('style="background-color: ' + color.toString() + ';"');
		attr.push('data-index="' + i + '"');
		attr.push('tabindex="0"');
		html.push('<li ' + attr.join(' ') + '></li>');
	}.bind(this));
	this.display.innerHTML = html.join('');
};

PaletteInput.prototype.onAddClick = function () {
	this.selectedIndex = this.palette.getCount();
	this.palette.addColor(this.colorInput.getColor());
	this.updateButtons();
	this.updateDisplay();
	this.triggerPaletteChange();
};

PaletteInput.prototype.onDeleteClick = function () {
	this.palette.removeColor(this.selectedIndex);
	this.selectedIndex = -1;
	this.updateButtons();
	this.updateDisplay();
	this.triggerPaletteChange();
};

PaletteInput.prototype.onColorChange = function () {
	if (this.ignoreColorChange) {
		this.ignoreColorChange = false;
		return;
	}
	if (this.selectedIndex > -1) {
		this.palette.updateColor(this.colorInput.getColor(), this.selectedIndex);
		this.updateDisplay();
		this.triggerPaletteChange();
	} else {
		this.updateButtons();
	}
};

PaletteInput.prototype.onColorClick = function (index) {
	if (index === -1) {
		if (this.selectedIndex === -1) {
			return;
		}
		this.selectedIndex = -1;
	} else if (index === this.selectedIndex) {
		this.selectedIndex = -1;
	} else {
		this.selectedIndex = index;
		this.ignoreColorChange = true;
		this.colorInput.setColor(this.palette.getColor(index));
	}
	this.updateButtons();
	this.updateDisplay();
	this.triggerSelectionChange();
};

PaletteInput.prototype.triggerPaletteChange = function () {
	this.dispatchEvent(new Event('change'));
};

PaletteInput.prototype.triggerSelectionChange = function () {
	this.dispatchEvent(new Event('change-selection'));
};

return PaletteInput;
})();