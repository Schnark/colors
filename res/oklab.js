/*global Color*/
(function () {
"use strict";

function dist (a, b, c) {
	return Math.sqrt(a * a + b * b + c * c);
}

Color.prototype.toOKLCH = function () {
	var r, g, b, x, y, z, l, m, s, L, a;
	function gamma (x) {
		x = x / 255;
		if (x <= 0.04045) {
			return x / 12.92;
		}
		return Math.pow((x + 0.055) / 1.055, 2.4);
	}
	r = gamma(this.r);
	g = gamma(this.g);
	b = gamma(this.b);
	x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
	y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
	l = 0.8190 * x + 0.3619 * y - 0.1289 * z;
	m = 0.0330 * x + 0.9293 * y + 0.0361 * z;
	s = 0.0482 * x + 0.2642 * y + 0.6335 * z;
	l = Math.pow(l, 1 / 3);
	m = Math.pow(m, 1 / 3);
	s = Math.pow(s, 1 / 3);
	L = 0.2105 * l + 0.7936 * m - 0.0041 * s;
	a = 1.9780 * l - 2.4286 * m + 0.4506 * s;
	b = 0.0259 * l + 0.7828 * m - 0.8087 * s;
	return {
		l: 100 * L,
		a: a,
		b: b,
		c: Math.sqrt(a * a + b * b),
		h: (Math.atan2(b, a) * 180 / Math.PI + 360) % 360
	};
};

Color.prototype.fromOKLCH = function (L, c, h) {
	var a, b, l, m, s, x, y, z, r, g, isInGamut = true;
	function gamma (x) {
		if (x < 0) {
			isInGamut = false;
			x = 0;
		} else if (x > 0.0031308) {
			x = 1.055 * (Math.pow(x, 1 / 2.4) - 0.055);
		} else {
			x = 12.92 * x;
		}
		if (x > 1) {
			isInGamut = false;
			x = 1;
		}
		return 255 * x;
	}
	L = L / 100;
	a = c * Math.cos(h * Math.PI / 180);
	b = c * Math.sin(h * Math.PI / 180);
	l = 1.0000 * L + 0.3963 * a + 0.2158 * b;
	m = 1.0000 * L - 0.1056 * a - 0.0639 * b;
	s = 1.0000 * L - 0.0895 * a - 1.2915 * b;
	l = l * l * l;
	m = m * m * m;
	s = s * s * s;
	x =  1.2269 * l - 0.5578 * m + 0.2814 * s;
	y = -0.0406 * l + 1.1123 * m - 0.0717 * s;
	z = -0.0764 * l - 0.4215 * m + 1.5869 * s;
	r =  3.2410 * x - 1.5374 * y - 0.4986 * z;
	g = -0.9692 * x + 1.8760 * y + 0.0416 * z;
	b =  0.0556 * x - 0.2040 * y + 1.0570 * z;
	this.fromRGB(gamma(r), gamma(g), gamma(b));
	return isInGamut;
};

Color.prototype.fromOKLCHGamutMap = function (L, c, h) {
	var minC = 0, maxC = c, minInGamut = true, currInGamut, jnd = 0.02, eps = 0.0001, e, lab;
	if (L >= 100) {
		return this.fromRGB(255, 255, 255);
	}
	if (L <= 0) {
		return this.fromRGB(0, 0, 0);
	}
	if (this.fromOKLCH(L, c, h)) {
		return this;
	}
	while (maxC - minC > eps) {
		c = (minC + maxC) / 2;
		currInGamut = this.fromOKLCH(L, c, h);
		if (currInGamut && minInGamut) {
			minC = c;
		} else if (!currInGamut) {
			lab = this.toOKLCH();
			e = dist(
				(lab.l - L) / 100,
				lab.a - c * Math.cos(h * Math.PI / 180),
				lab.b - c * Math.sin(h * Math.PI / 180)
			);
			if (e < jnd) {
				if (jnd - e < eps) {
					return this;
				} else {
					minInGamut = false;
					minC = c;
				}
			} else {
				maxC = c;
			}
		}
	}
	return this;
};

Color.deltaOK = function (c0, c1) {
	c0 = c0.toOKLCH();
	c1 = c1.toOKLCH();
	return dist((c0.l - c1.l) / 100, c0.a - c1.a, c0.b - c1.b);
};

})();