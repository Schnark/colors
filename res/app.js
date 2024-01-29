/*global storedCollection, Palette,
	ColorInput, PaletteInput, ToolManager,
	LoadTool, CodeTool, PaletteTool, ModifyTool,
	ContrastTool, DataTool, ColorblindnessTool*/
(function () {
"use strict";

var currentPalette = new Palette(),
	colorInput = new ColorInput(),
	paletteInput = new PaletteInput(colorInput),
	toolManager = new ToolManager(paletteInput);

currentPalette.fromHexList(storedCollection.getCurrent());
paletteInput.setPalette(currentPalette);
paletteInput.addEventListener('change', function () {
	var list = [];
	paletteInput.getPalette().forEach(function (color) {
		list.push(color.toString());
	});
	storedCollection.setCurrent(list);
});

toolManager.register(new LoadTool(paletteInput));
toolManager.register(new CodeTool(paletteInput));
toolManager.register(new PaletteTool(paletteInput));
toolManager.register(new ModifyTool(paletteInput));
toolManager.register(new ContrastTool(paletteInput));
toolManager.register(new DataTool(paletteInput));
toolManager.register(new ColorblindnessTool(paletteInput));
//TODO tool to mix colors?

})();