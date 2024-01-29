/*global Color*/
(function () {
"use strict";

var colorBlindness = {};

Color.prototype.applyRGBMatrix = function (m) {
	return this.fromRGB(
		m[0][0] * this.r + m[0][1] * this.g + m[0][2] * this.b,
		m[1][0] * this.r + m[1][1] * this.g + m[1][2] * this.b,
		m[2][0] * this.r + m[2][1] * this.g + m[2][2] * this.b
	);
};

colorBlindness.protanopia = [
	[0.567, 0.433, 0],
	[0.558, 0.442, 0],
	[0, 0.242, 0.758]
];
colorBlindness.protanomaly = [
	[0.817, 0.183, 0],
	[0.333, 0.667, 0],
	[0, 0.125, 0.875]
];
colorBlindness.deuteranopia = [
	[0.625, 0.375, 0],
	[0.7, 0.3, 0],
	[0, 0.3, 0.7]
];
colorBlindness.deuteranomaly = [
	[0.8, 0.2, 0],
	[0.258, 0.742, 0],
	[0, 0.142, 0.858]
];
colorBlindness.tritanopia = [
	[0.95, 0.05, 0],
	[0, 0.433, 0.567],
	[0, 0.475, 0.525]
];
colorBlindness.tritanomaly = [
	[0.967, 0.033, 0],
	[0, 0.733, 0.267],
	[0, 0.183, 0.817]
];
colorBlindness.achromatopsia = [
	[0.299, 0.587, 0.114],
	[0.299, 0.587, 0.114],
	[0.299, 0.587, 0.114]
];
colorBlindness.achromatomaly = [
	[0.618, 0.320, 0.062],
	[0.163, 0.775, 0.062],
	[0.163, 0.320, 0.516]
];

Color.prototype.simulateColorBlindness = function (type) {
	return this.clone().applyRGBMatrix(colorBlindness[type]);
};

Color.prototype.getModifiedColor = function (type, val) {
	var result = this.clone(), lch;
	function angleTo (start, end, val) {
		start = (((start - end) % 360) + 360) % 360;
		return end + (start > 180 ? start + val * (360 - start) : (1 - val) * start);
	}
	if (val === 0) {
		return result;
	}
	switch (type) {
	case 'hue':
		return result.fromHSL(result.h + 180 * val, result.s, result.l);
	case 'hue-oklab':
		lch = result.toOKLCH();
		return result.fromOKLCHGamutMap(lch.l, lch.c, lch.h + 180 * val);
	case 'saturation':
		return result.fromHSL(result.h, result.s + val * (val > 0 ? 100 - result.s : result.s), result.l);
	case 'saturation-oklab':
		lch = result.toOKLCH();
		return result.fromOKLCHGamutMap(lch.l, lch.c + val * (val > 0 ? 0.4 - lch.c : lch.c), lch.h);
	case 'lightness':
		return result.fromHSL(result.h, result.s, result.l + val * (val > 0 ? 100 - result.l : result.l));
	case 'lightness-oklab':
		lch = result.toOKLCH();
		return result.fromOKLCHGamutMap(lch.l + val * (val > 0 ? 100 - lch.l : lch.l), lch.c, lch.h);
	case 'temperature':
		if (val > 0) {
			return result.fromHSL(angleTo(result.h, 0, val), result.s, result.l); //warmer, to red
		}
		return result.fromHSL(angleTo(result.h, 240, -val), result.s, result.l); //colder, to blue
	case 'temperature-oklab':
		lch = result.toOKLCH();
		if (val > 0) {
			return result.fromOKLCHGamutMap(lch.l, lch.c, angleTo(lch.h, 30, val));
		}
		return result.fromOKLCHGamutMap(lch.l, lch.c, angleTo(lch.h, 265, -val));
	}
};

Color.prototype.getSimilarColors = function (oklab) {
	var mode = oklab ? '-oklab' : '';
	return [
		{
			label: 'Lightness',
			colors: [
				this.getModifiedColor('lightness' + mode, -0.5),
				this.getModifiedColor('lightness' + mode, -0.25),
				this.getModifiedColor('lightness' + mode, 0.25),
				this.getModifiedColor('lightness' + mode, 0.5)
			]
		}, {
			label: 'Saturation',
			colors: [
				this.getModifiedColor('saturation' + mode, -0.5),
				this.getModifiedColor('saturation' + mode, -0.25),
				this.getModifiedColor('saturation' + mode, 0.25),
				this.getModifiedColor('saturation' + mode, 0.5)
			]
		}, {
			label: 'Hue',
			colors: [
				this.getModifiedColor('hue' + mode, -0.2),
				this.getModifiedColor('hue' + mode, -0.1),
				this.getModifiedColor('hue' + mode, 0.1),
				this.getModifiedColor('hue' + mode, 0.2)
			]
		}, {
			label: 'Inverse, Triade, Tetrade',
			colors: [
				this.getModifiedColor('hue' + mode, 1),
				this.getModifiedColor('hue' + mode, -2 / 3),
				this.getModifiedColor('hue' + mode, 2 / 3),
				this.getModifiedColor('hue' + mode, -0.5),
				this.getModifiedColor('hue' + mode, 0.5)
			]
		}
	];
};

})();