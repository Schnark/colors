/*global ColorInput: true*/
/*global Color, util*/
/*global Event*/
ColorInput =
(function () {
"use strict";

function convertXYtoColor (color, mode, x, y, allowNull) {
	var polar, w, b;
	function toPolar (x, y) {
		return {
			phi: Math.atan2(x, y) * 180 / Math.PI,
			r: Math.sqrt(x * x + y * y)
		};
	}
	switch (mode) {
	case 'rgb-r':
		color.fromRGB(color.r, x * 255, y * 255);
		break;
	case 'rgb-g':
		color.fromRGB(x * 255, color.g, y * 255);
		break;
	case 'rgb-b':
		color.fromRGB(x * 255, y * 255, color.b);
		break;
	case 'hsl-h':
		color.fromHSL(color.h, x * 100, y * 100);
		break;
	case 'hsl-s':
		polar = toPolar(2 * x - 1, 2 * y - 1);
		if (polar.r > 1) {
			if (allowNull) {
				return null;
			}
			polar.r = 1;
		}
		color.fromHSL(polar.phi, color.s, polar.r * 100);
		break;
	case 'hsl-l':
		polar = toPolar(2 * x - 1, 2 * y - 1);
		if (polar.r > 1) {
			if (allowNull) {
				return null;
			}
			polar.r = 1;
		}
		color.fromHSL(polar.phi, polar.r * 100, color.l);
		break;
	case 'hwb-h':
		w = 1 - x - 0.5 * y;
		b = x - 0.5 * y;
		if (w < 0) {
			if (allowNull) {
				return null;
			}
			w = 0;
		}
		if (b < 0) {
			if (allowNull) {
				return null;
			}
			b = 0;
		}
		color.fromHWB(color.h, w * 100, b * 100);
		break;
	case 'hwb-w':
		polar = toPolar(2 * x - 1, 2 * y - 1);
		if (polar.r > 1) {
			if (allowNull) {
				return null;
			}
			polar.r = 1;
		}
		color.fromHWB(polar.phi, color.white, 100 - polar.r * 100);
		break;
	case 'hwb-b':
		polar = toPolar(2 * x - 1, 2 * y - 1);
		if (polar.r > 1) {
			if (allowNull) {
				return null;
			}
			polar.r = 1;
		}
		color.fromHWB(polar.phi, 100 - polar.r * 100, color.black);
	}
	return color;
}

function convertZtoColor (color, mode, z) {
	switch (mode) {
	case 'rgb-r':
		color.fromRGB(z * 255, color.g, color.b);
		break;
	case 'rgb-g':
		color.fromRGB(color.r, z * 255, color.b);
		break;
	case 'rgb-b':
		color.fromRGB(color.r, color.g, z * 255);
		break;
	case 'hsl-h':
		color.fromHSL(360 - z * 360, color.s, color.l);
		break;
	case 'hsl-s':
		color.fromHSL(color.h, z * 100, color.l);
		break;
	case 'hsl-l':
		color.fromHSL(color.h, color.s, z * 100);
		break;
	case 'hwb-h':
		color.fromHWB(360 - z * 360, color.white, color.black);
		break;
	case 'hwb-w':
		color.fromHWB(color.h, z * 100, color.black);
		break;
	case 'hwb-b':
		color.fromHWB(color.h, color.white, z * 100);
	}
	return color;
}

function convertColorToXYZ (color, mode) {
	var xy, w, b;
	function toXY (phi, r) {
		phi *= Math.PI / 180;
		return {
			x: r * Math.sin(phi),
			y: r * Math.cos(phi)
		};
	}
	switch (mode) {
	case 'rgb-r':
		return {x: color.g / 255, y: color.b / 255, z: color.r / 255};
	case 'rgb-g':
		return {x: color.r / 255, y: color.b / 255, z: color.g / 255};
	case 'rgb-b':
		return {x: color.r / 255, y: color.g / 255, z: color.b / 255};
	case 'hsl-h':
		return {x: color.s / 100, y: color.l / 100, z: 1 - color.h / 360};
	case 'hsl-s':
		xy = toXY(color.h, color.l / 100);
		return {x: 0.5 + xy.x * 0.5, y: 0.5 + xy.y * 0.5, z: color.s / 100};
	case 'hsl-l':
		xy = toXY(color.h, color.s / 100);
		return {x: 0.5 + xy.x * 0.5, y: 0.5 + xy.y * 0.5, z: color.l / 100};
	case 'hwb-h':
		w = color.white / 100;
		b = color.black / 100;
		if (w + b > 1) {
			w /= (w + b);
			b = 1 - w; //b /= (w + b); with old values
		}
		return {x: 0.5 * (1 + b - w), y: 1 - w - b, z: 1 - color.h / 360};
	case 'hwb-w':
		xy = toXY(color.h, 1 - color.black / 100);
		return {x: 0.5 + xy.x * 0.5, y: 0.5 + xy.y * 0.5, z: color.white / 100};
	case 'hwb-b':
		xy = toXY(color.h, 1 - color.white / 100);
		return {x: 0.5 + xy.x * 0.5, y: 0.5 + xy.y * 0.5, z: color.black / 100};
	}
}

function prepareImageData2 (imageData, color, mode) {
	var x, y, i = 0, c;
	for (y = 0; y < imageData.height; y++) {
		for (x = 0; x < imageData.width; x++) {
			c = convertXYtoColor(color, mode, x / (imageData.width - 1), 1 - y / (imageData.height - 1), true);
			if (c) {
				imageData.data[i] = Math.round(c.r);
				imageData.data[i + 1] = Math.round(c.g);
				imageData.data[i + 2] = Math.round(c.b);
				imageData.data[i + 3] = 255;
			} else {
				imageData.data[i] = 136;
				imageData.data[i + 1] = 136;
				imageData.data[i + 2] = 136;
				imageData.data[i + 3] = 255;
			}
			i += 4;
		}
	}
	return imageData;
}

function prepareImageData1 (imageData, color, mode) {
	var z, i = 0, j, c;
	for (z = 0; z < imageData.height; z++) {
		c = convertZtoColor(color, mode, 1 - z / (imageData.height - 1));
		for (j = 0; j < imageData.width; j++) {
			imageData.data[i] = Math.round(c.r);
			imageData.data[i + 1] = Math.round(c.g);
			imageData.data[i + 2] = Math.round(c.b);
			imageData.data[i + 3] = 255;
			i += 4;
		}
	}
	return imageData;
}

function paintCanvas2 (ctx, imageData, color, mode, r) {
	var w = ctx.canvas.width - 2 * r,
		h = ctx.canvas.height - 2 * r,
		xyz = convertColorToXYZ(color, mode);
	if (!imageData) {
		imageData = ctx.createImageData(w, h);
	}
	ctx.fillStyle = '#888';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.putImageData(prepareImageData2(imageData, color, mode), r, r);
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.arc(xyz.x * w + r, h - xyz.y * h + r, r, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.strokeStyle = '#fff';
	ctx.beginPath();
	ctx.arc(xyz.x * w + r, h - xyz.y * h + r, r - 1, 0, 2 * Math.PI);
	ctx.stroke();
	return imageData;
}

function paintCanvas1 (ctx, imageData, color, mode, r) {
	var h = ctx.canvas.height - 2 * r,
		xyz = convertColorToXYZ(color, mode);
	if (!imageData) {
		imageData = ctx.createImageData(ctx.canvas.width - 4, h);
	}
	ctx.fillStyle = '#888';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.putImageData(prepareImageData1(imageData, color, mode), 2, r);
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.arc(ctx.canvas.width / 2, (1 - xyz.z) * h + r, r, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.strokeStyle = '#fff';
	ctx.beginPath();
	ctx.arc(ctx.canvas.width / 2, (1 - xyz.z) * h + r, r - 1, 0, 2 * Math.PI);
	ctx.stroke();
	return imageData;
}

function relCoordsFromEvent (e, r) {
	var x, y, rect;
	function clamp01 (x) {
		return x < 0 ? 0 : x > 1 ? 1 : x;
	}
	x = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : e.clientX;
	y = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : e.clientY;
	rect = e.target.getBoundingClientRect();
	return {
		x: clamp01((x - rect.left - r) / (rect.width - 2 * r - 1)),
		y: clamp01(1 - (y - rect.top - r) / (rect.height - 2 * r - 1))
	};
}

function ColorInput () {
	this.elements = {};
	['rgb-r', 'rgb-g', 'rgb-b', 'hsl-h', 'hsl-s', 'hsl-l', 'hwb-h', 'hwb-w', 'hwb-b'].forEach(function (id) {
		this.elements[id] = document.getElementById(id);
		this.elements[id + '-select'] = document.getElementById(id + '-select');
		this.elements[id].addEventListener('focus', function (e) {
			this.focusHandler(e.target);
		}.bind(this));
		this.elements[id].addEventListener('change', this.changeHandler.bind(this));
		this.elements[id + '-select'].addEventListener('change', function (e) {
			this.selectHandler(e.target);
		}.bind(this));
	}, this);
	this.elements.output = document.getElementById('color-input-output');
	this.elements.code = document.getElementById('color-input-code');
	this.elements.canvas2 = document.getElementById('color-input-canvas2');
	this.elements.canvas2.width = 256 + 2 * 5;
	this.elements.canvas2.height = 256 + 2 * 5;
	this.elements.canvas1 = document.getElementById('color-input-canvas1');
	this.elements.canvas1.width = 2 * 5;
	this.elements.canvas1.height = 256 + 2 * 5;
	this.elements.ctx2 = this.elements.canvas2.getContext('2d');
	this.elements.ctx1 = this.elements.canvas1.getContext('2d');

	function onMouseupdown2 (e) {
		/*jshint validthis: true*/
		var coords = relCoordsFromEvent(e, 5);
		this.canvas2Handler(coords.x, coords.y);
		e.preventDefault();
	}

	function onMousemove2 (e) {
		/*jshint validthis: true*/
		var coords;
		if (e.buttons === 1 || (e.changedTouches && e.changedTouches[0])) {
			if (!this.throttled) {
				coords = relCoordsFromEvent(e, 5);
				this.canvas2Handler(coords.x, coords.y);
				this.throttled = true;
				window.setTimeout(function () {
					this.throttled = false;
				}.bind(this), 50);
			}
			e.preventDefault();
		}
	}

	function onMouseupdown1 (e) {
		/*jshint validthis: true*/
		var coords = relCoordsFromEvent(e, 5);
		this.canvas1Handler(coords.y);
		e.preventDefault();
	}

	function onMousemove1 (e) {
		/*jshint validthis: true*/
		var coords;
		if (e.buttons === 1 || (e.changedTouches && e.changedTouches[0])) {
			if (!this.throttled) {
				coords = relCoordsFromEvent(e, 5);
				this.canvas1Handler(coords.y);
				this.throttled = true;
				window.setTimeout(function () {
					this.throttled = false;
				}.bind(this), 50);
			}
			e.preventDefault();
		}
	}

	this.elements.canvas2.addEventListener('mousedown', onMouseupdown2.bind(this));
	this.elements.canvas2.addEventListener('mouseup', onMouseupdown2.bind(this));
	this.elements.canvas2.addEventListener('touchstart', onMouseupdown2.bind(this));
	this.elements.canvas2.addEventListener('touchend', onMouseupdown2.bind(this));
	this.elements.canvas2.addEventListener('mousemove', onMousemove2.bind(this));
	this.elements.canvas2.addEventListener('touchmove', onMousemove2.bind(this));

	this.elements.canvas1.addEventListener('mousedown', onMouseupdown1.bind(this));
	this.elements.canvas1.addEventListener('mouseup', onMouseupdown1.bind(this));
	this.elements.canvas1.addEventListener('touchstart', onMouseupdown1.bind(this));
	this.elements.canvas1.addEventListener('touchend', onMouseupdown1.bind(this));
	this.elements.canvas1.addEventListener('mousemove', onMousemove1.bind(this));
	this.elements.canvas1.addEventListener('touchmove', onMousemove1.bind(this));
	this.setMode('rgb-r');
	this.setColor(new Color());
}

util.mixinEventTarget(ColorInput);

ColorInput.prototype.setColor = function (color) {
	var code = color.toString();
	this.color = color;
	this.elements['rgb-r'].value = Math.round(color.r);
	this.elements['rgb-g'].value = Math.round(color.g);
	this.elements['rgb-b'].value = Math.round(color.b);
	this.elements['hsl-h'].value = Math.round(color.h);
	this.elements['hsl-s'].value = Math.round(color.s);
	this.elements['hsl-l'].value = Math.round(color.l);
	this.elements['hwb-h'].value = Math.round(color.h);
	this.elements['hwb-w'].value = Math.round(color.white);
	this.elements['hwb-b'].value = Math.round(color.black);
	this.updateCanvas();
	this.elements.output.style.backgroundColor = code;
	this.elements.code.textContent = code;
	this.triggerColorChange();
};

ColorInput.prototype.setMode = function (mode) {
	if (this.mode !== mode) {
		this.mode = mode;
		this.elements[mode + '-select'].checked = true;
		if (this.color) {
			this.updateCanvas();
		}
	}
};

ColorInput.prototype.getColor = function () {
	return this.color.clone();
};

ColorInput.prototype.updateCanvas = function () {
	this.elements.imageData2 = paintCanvas2(this.elements.ctx2, this.elements.imageData2, this.color.clone(), this.mode, 5);
	this.elements.imageData1 = paintCanvas1(this.elements.ctx1, this.elements.imageData1, this.color.clone(), this.mode, 5);
};

ColorInput.prototype.focusHandler = function (target) {
	this.setMode(target.id);
};

ColorInput.prototype.changeHandler = function () {
	switch (this.mode.slice(0, 3)) {
	case 'rgb':
		this.color.fromRGB(
			Number(this.elements['rgb-r'].value),
			Number(this.elements['rgb-g'].value),
			Number(this.elements['rgb-b'].value)
		);
		break;
	case 'hsl':
		this.color.fromHSL(
			Number(this.elements['hsl-h'].value),
			Number(this.elements['hsl-s'].value),
			Number(this.elements['hsl-l'].value)
		);
		break;
	case 'hwb':
		this.color.fromHWB(
			Number(this.elements['hwb-h'].value),
			Number(this.elements['hwb-w'].value),
			Number(this.elements['hwb-b'].value)
		);
	}
	this.setColor(this.color);
};

ColorInput.prototype.selectHandler = function (target) {
	this.setMode(target.id.slice(0, 5));
};

ColorInput.prototype.canvas2Handler = function (x, y) {
	this.setColor(convertXYtoColor(this.color, this.mode, x, y, false));
};

ColorInput.prototype.canvas1Handler = function (z) {
	this.setColor(convertZtoColor(this.color, this.mode, z));
};

ColorInput.prototype.triggerColorChange = function () {
	this.dispatchEvent(new Event('change'));
};

return ColorInput;
})();