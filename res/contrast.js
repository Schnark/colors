/*global Color*/
(function () {
"use strict";

Color.prototype.getLuminance = function () {
	function gamma (x) {
		x = x / 255;
		if (x <= 0.04045) { //originally 0.03928, but doesn't matter anyway
			return x / 12.92;
		}
		return Math.pow((x + 0.055) / 1.055, 2.4);
	}
	return 0.2126 * gamma(this.r) + 0.7152 * gamma(this.g) + 0.0722 * gamma(this.b);
};

Color.prototype.getAPCALuminance = function () {
	var luminance;
	function gamma (x) {
		return Math.pow(x / 255, 2.4);
	}
	luminance = 0.2126729 * gamma(this.r) + 0.7151522 * gamma(this.g) + 0.0721750 * gamma(this.b);
	if (luminance < 0.022) {
		luminance += Math.pow(0.022 - luminance, 1.414);
	}
	return luminance;
};

function getContrast (color0, color1) {
	var luminance0, luminance1, contrast;
	luminance0 = color0.getLuminance();
	luminance1 = color1.getLuminance();
	contrast = (luminance0 + 0.05) / (luminance1 + 0.05);
	if (contrast < 1) {
		contrast = 1 / contrast;
	}
	return contrast;
}

function getAPCAContrast (color0, color1) {
	var luminance0, luminance1, contrast;
	luminance0 = color0.getAPCALuminance();
	luminance1 = color1.getAPCALuminance();
	if (Math.abs(luminance0 - luminance1) < 0.0005) {
		contrast = 0;
	} else if (luminance0 > luminance1) {
		contrast = Math.pow(luminance0, 0.62) - Math.pow(luminance1, 0.65); //drop sign
	} else {
		contrast = Math.pow(luminance1, 0.56) - Math.pow(luminance0, 0.57);
	}
	contrast *= 1.14;
	if (contrast < 0.1) {
		contrast = 0;
	} else {
		contrast -= 0.027;
	}
	return contrast * 100;
}
//45 similar to 3:1, 60 to 4.5:1, 75 to 7:1

Color.prototype.round = function () {
	return this.fromRGB(Math.round(this.r), Math.round(this.g), Math.round(this.b));
};

function binarySearchColor (isGood, getColor) {
	var tMin = 0, tMax = 1, t, cMin, cMax, c;
	cMin = getColor(tMin).round();
	if (isGood(cMin)) {
		return cMin;
	}
	cMax = getColor(tMax).round();
	if (!isGood(cMax)) {
		return null;
	}
	while (true) {
		t = (tMin + tMax) / 2;
		c = getColor(t).round();
		if (c.toString() === cMin.toString() || c.toString() === cMax.toString()) {
			return cMax;
		}
		if (isGood(c)) {
			tMax = t;
			cMax = c;
		} else {
			tMin = t;
			cMin = c;
		}
	}
}

function getColorCheckFunction (baseColor, isFirst, contrast) {
	return function (color) {
		var color0, color1;
		if (isFirst) {
			color0 = baseColor;
			color1 = color;
		} else {
			color0 = color;
			color1 = baseColor;
		}
		return getContrast(color0, color1) >= contrast;
	};
}

function getColorInterpolateFunction (baseColor, darker) {
	return function (t) {
		var l;
		if (darker) {
			l = (1 - t) * baseColor.l;
		} else {
			l = baseColor.l + (100 - baseColor.l) * t;
		}
		return (new Color()).fromHSL(baseColor.h, baseColor.s, l);
	};
}

function findColorForContrast (baseColor, adaptColor, contrast, isFirst, darker) {
	return binarySearchColor(
		getColorCheckFunction(baseColor, isFirst, contrast),
		getColorInterpolateFunction(adaptColor, darker)
	);
}

function getContrastAndAlternativeColors (color0, color1, contrast) {
	var color, result = {};
	result.contrast = getContrast(color0, color1);
	if (result.contrast >= contrast) {
		return result;
	}
	color = findColorForContrast(color0, color1, contrast, true, true);
	if (color) {
		result.modify1darker = [color0, color];
	}
	color = findColorForContrast(color0, color1, contrast, true, false);
	if (color) {
		result.modify1lighter = [color0, color];
	}
	color = findColorForContrast(color1, color0, contrast, false, true);
	if (color) {
		result.modify0darker = [color, color1];
	}
	color = findColorForContrast(color1, color0, contrast, false, false);
	if (color) {
		result.modify0lighter = [color, color1];
	}

	return result;
}

Color.getContrast = getContrast;
Color.getAPCAContrast = getAPCAContrast;
Color.getContrastAndAlternativeColors = getContrastAndAlternativeColors;

})();