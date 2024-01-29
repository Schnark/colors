/*global ContrastTool: true*/
/*global Color, Tool*/
ContrastTool =
(function () {
"use strict";

function ContrastTool (paletteInput) {
	this.init(document.getElementById('contrast-tool'), paletteInput);
	this.levelInput = document.getElementById('contrast-level');
	this.largeInput = document.getElementById('contrast-large');
	this.table = document.getElementById('contrast-table');
	this.modify = document.getElementById('contrast-modify');
	this.buttonData = [];
	this.levelInput.addEventListener('change', this.update.bind(this));
	this.largeInput.addEventListener('change', this.update.bind(this));
	this.table.addEventListener('click', this.onTableClick.bind(this));
	this.modify.addEventListener('click', this.onModifyClick.bind(this));
}

ContrastTool.prototype = new Tool();

ContrastTool.prototype.getExampleHtml = function (color0, color1) {
	var code0 = color0.toString(),
		code1 = color1.toString(),
		style = 'color: ' + code0 + '; background-color: ' + code1 + ';',
		text = '<code>' + code0 + '</code><br>\non<br>\n<code>' + code1 + '</code>';
	if (this.largeInput.checked) {
		style += 'font-size: 19px; font-weight: bold;';
	}
	return '<div style="' + style + '">' + text + '</div>';
};

ContrastTool.prototype.getBlock = function (color0, color1, above, below) {
	return '<div style="width: 8em; display: inline-block; text-align: center;">' +
		above + this.getExampleHtml(color0, color1) + below + '</div>';
};

ContrastTool.prototype.createButton = function (index, color) {
	var i = this.buttonData.length;
	this.buttonData.push({
		index: index,
		color: color
	});
	return '<button data-index="' + i + '">Modify colors</button>';
};

ContrastTool.prototype.update = function () {
	var palette, count, color0, color1, contrast, html, data, contrasts;
	if (this.largeInput.checked) {
		contrasts = {
			aaa: 4.5,
			aa: 3
		};
	} else {
		contrasts = {
			aaa: 7,
			aa: 4.5
		};
	}
	palette = this.paletteInput.getPalette();
	count = palette.getCount();
	if (this.selected && (this.selected[0] >= count || this.selected[1] >= count)) {
		this.selected = false;
	}
	this.buildTable(this.table, function (color0, color1, i, j) {
		var contrast, label = '&nbsp;', attr = [];
		if (i === j) {
			return '<td></td>';
		}
		contrast = Color.getContrast(color0, color1);
		if (contrast >= contrasts.aaa) {
			label = 'AAA';
		} else if (contrast >= contrasts.aa) {
			label = 'AA';
		}
		attr.push('data-i="' + i + '"');
		attr.push('data-j="' + j + '"');
		if (this.selected && this.selected[0] === String(i) && this.selected[1] === String(j)) {
			attr.push('class="selected"');
		}
		return '<td ' + attr.join(' ') + '>' +
			(Math.round(contrast * 10) / 10).toFixed(1) + '<br><small>' + label + '</small></td>';
	}.bind(this));
	this.buttonData = [];
	if (this.selected) {
		color0 = palette.getColor(this.selected[0]);
		color1 = palette.getColor(this.selected[1]);
		contrast = Color.getContrast(color0, color1);
		html = this.getBlock(
			color0, color1, 'Original',
			'<div style="padding: 3px;">' + (Math.round(contrast * 100) / 100).toFixed(2) + '</div>'
		);
		data = Color.getContrastAndAlternativeColors(color0, color1, contrasts[this.levelInput.value]);
		if (data.modify0lighter) {
			html += this.getBlock(
				data.modify0lighter[0], data.modify0lighter[1],
				'Lighter text', this.createButton(this.selected[0], data.modify0lighter[0])
			);
		}
		if (data.modify0darker) {
			html += this.getBlock(
				data.modify0darker[0], data.modify0darker[1],
				'Darker text', this.createButton(this.selected[0], data.modify0darker[0])
			);
		}
		if (data.modify1lighter) {
			html += this.getBlock(
				data.modify1lighter[0], data.modify1lighter[1],
				'Ligher background', this.createButton(this.selected[1], data.modify1lighter[1])
			);
		}
		if (data.modify1darker) {
			html += this.getBlock(
				data.modify1darker[0], data.modify1darker[1],
				'Darker background', this.createButton(this.selected[1], data.modify1darker[1])
			);
		}
		this.modify.innerHTML = html;
	} else {
		this.modify.innerHTML = '';
	}
};

ContrastTool.prototype.onTableClick = function (e) {
	var data = e.target.dataset;
	if (!data.i) {
		data = e.target.parentElement.dataset;
	}
	if (data.i && data.j) {
		if (this.selected && this.selected[0] === data.i && this.selected[1] === data.j) {
			this.selected = false;
		} else {
			this.selected = [data.i, data.j];
		}
		this.update();
	}
};

ContrastTool.prototype.onModifyClick = function (e) {
	var index = e.target.dataset.index, palette;
	if (index) {
		palette = this.paletteInput.getPalette();
		palette.updateColor(this.buttonData[index].color, this.buttonData[index].index);
		this.paletteInput.setPalette(palette);
	}
};

return ContrastTool;
})();