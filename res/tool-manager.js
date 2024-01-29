/*global ToolManager: true*/
ToolManager =
(function () {
"use strict";

function ToolManager (paletteInput) {
	this.tools = [];
	this.activeIndex = -1;
	paletteInput.addEventListener('change', function () {
		this.onChange();
	}.bind(this));
	paletteInput.addEventListener('change-selection', function () {
		this.onChange(true);
	}.bind(this));
}

ToolManager.prototype.register = function (tool) {
	var index = this.tools.length;
	this.tools.push(tool);
	tool.getHandle().addEventListener('click', function () {
		this.toggle(index);
	}.bind(this));
};

ToolManager.prototype.toggle = function (index) {
	if (this.activeIndex === index) {
		this.tools[index].deactivate();
		this.activeIndex = -1;
	} else {
		if (this.activeIndex > -1) {
			this.tools[this.activeIndex].deactivate();
		}
		this.tools[index].activate();
		this.activeIndex = index;
	}
};

ToolManager.prototype.onChange = function (selectionOnly) {
	if (this.activeIndex > -1) {
		if (!selectionOnly || this.tools[this.activeIndex].updateOnSelectionChange) {
			this.tools[this.activeIndex].update();
		}
	}
};

return ToolManager;
})();