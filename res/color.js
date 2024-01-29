/*global Color: true*/
Color =
(function () {
"use strict";

function Color () {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.h = 0;
	this.s = 0;
	this.l = 0;
	this.white = 0;
	this.black = 100;
}

Color.fromHex = function (code) {
	return (new Color()).fromRGB(
		parseInt(code.slice(1, 3), 16),
		parseInt(code.slice(3, 5), 16),
		parseInt(code.slice(5, 7), 16)
	);
};

Color.prototype.fromRGB = function (r, g, b) {
	var max, min, diff, h, l;
	this.r = r;
	this.g = g;
	this.b = b;
	r /= 255;
	g /= 255;
	b /= 255;
	max = Math.max(r, g, b);
	min = Math.min(r, g, b);
	diff = max - min;
	l = (min + max) / 2;
	this.l = 100 * l;
	if (l > 0 && l < 1) {
		if (diff !== 0) {
			this.s = 100 * (max - l) / Math.min(l, 1 - l);
			switch (max) {
			case r:
				h = (g - b) / diff + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / diff + 2;
				break;
			case b:
				h = (r - g) / diff + 4;
			}
			this.h = h * 60;
		} else {
			this.s = 0;
		}
	}
	this.white = 100 * min;
	this.black = 100 * (1 - max);
	return this;
};

Color.prototype.fromHSL = function (h, s, l) {
	var r, g, b;
	h = ((h % 360) + 360) % 360;
	this.h = h;
	this.s = s;
	this.l = l;

	s /= 100;
	l /= 100;

	function f (n) {
		var k, a;
		k = (n + h / 30) % 12;
		a = s * Math.min(l, 1 - l);
		return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
	}

	r = f(0);
	g = f(8);
	b = f(4);
	this.r = r * 255;
	this.g = g * 255;
	this.b = b * 255;
	this.white = 100 * Math.min(r, g, b);
	this.black = 100 * (1 - Math.max(r, g, b));
	return this;
};

Color.prototype.fromHWB = function (h, w, b) {
	var gray, r, g, min, max, l;
	h = ((h % 360) + 360) % 360;
	this.h = h;
	this.white = w;
	this.black = b;
	w /= 100;
	b /= 100;
	if (w + b >= 1) {
		gray = w / (w + b);
		this.r = gray * 255;
		this.g = gray * 255;
		this.b = gray * 255;
		this.l = gray * 100;
		if (gray > 0 && gray < 1) {
			this.s = 0;
		}
		return;
	}

	function f (n) {
		var k;
		k = (n + h / 30) % 12;
		return 0.5 * (1 - Math.max(-1, Math.min(k - 3, 9 - k, 1)));
	}

	r = f(0) * (1 - w - b) + w;
	g = f(8) * (1 - w - b) + w;
	b = f(4) * (1 - w - b) + w; //from now on b is blue, not black
	this.r = r * 255;
	this.g = g * 255;
	this.b = b * 255;
	min = Math.min(r, g, b);
	max = Math.max(r, g, b);
	l = (min + max) / 2;
	this.l = 100 * l;
	if (l > 0 && l < 1 && min !== max) {
		this.s = 100 * (max - l) / Math.min(l, 1 - l);
	}
	return this;
};

Color.prototype.clone = function () {
	var color = new Color();
	['r', 'g', 'b', 'h', 's', 'l', 'white', 'black'].forEach(function (key) {
		color[key] = this[key];
	}, this);
	return color;
};

Color.prototype.toString = function () {
	function hex (n) {
		n = Math.round(n).toString(16);
		if (n.length === 1) {
			n = '0' + n;
		}
		return n;
	}
	return '#' + hex(this.r) + hex(this.g) + hex(this.b);
};

Color.prototype.toStrings = function () {
	var oklch = this.toOKLCH();
	function hex1 (n) {
		return Math.round(n / 17).toString(16);
	}
	function round (n, f) {
		f = f || 1;
		return Math.round(n * f) / f;
	}
	return [
		this.toString(),
		'#' + hex1(this.r) + hex1(this.g) + hex1(this.b),
		'rgb(' + round(this.r) + ', ' + round(this.g) + ', ' + round(this.b) + ')',
		'rgb(' + round(this.r, 100) + ' ' + round(this.g, 100) + ' ' + round(this.b, 100) + ')',
		'color(srgb ' + round(this.r / 255, 10000) + ' ' + round(this.g / 255, 10000) + ' ' + round(this.b / 255, 10000) + ')',
		'hsl(' + round(this.h) + ', ' + round(this.s) + '%, ' + round(this.l) + '%)',
		'hsl(' + round(this.h, 100) + 'deg ' + round(this.s, 100) + '% ' + round(this.l, 100) + '%)',
		'hwb(' + round(this.h, 100) + 'deg ' + round(this.white, 100) + '% ' + round(this.black, 100) + '%)',
		'oklch(' + round(oklch.l, 100) + '% ' + round(oklch.c, 10000) + ' ' + round(oklch.h, 100) + 'deg)'
	];
};

return Color;
})();