/*global DataTool: true*/
/*global Tool, Color*/
DataTool =
(function () {
"use strict";

function DataTool (paletteInput) {
	this.init(document.getElementById('data-tool'), paletteInput);
	this.methodInput = document.getElementById('data-tool-method');
	this.table = document.getElementById('data-tool-output');
	this.methodInput.addEventListener('change', this.update.bind(this));
}

DataTool.prototype = new Tool();

DataTool.prototype.update = function () {
	this.buildTable(this.table, function (color0, color1, i, j) {
		var data;
		if (i === j) {
			return '<td></td>';
		}
		switch (this.methodInput.value) {
		case 'contrast':
			data = (Math.round(Color.getContrast(color0, color1) * 10) / 10).toFixed(1);
			break;
		case 'apca':
			data = Math.round(Color.getAPCAContrast(color0, color1));
			break;
		case 'deltaok':
			data = (Math.round(Color.deltaOK(color0, color1) * 100) / 10).toFixed(1);
		}
		return '<td>' + data + '</td>';
	}.bind(this));
};

return DataTool;
})();