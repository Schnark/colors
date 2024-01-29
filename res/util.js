/*global util: true*/
util =
(function () {
"use strict";

function mixinEventTarget (Class) {
	var el = document.createElement('span');
	function copyMethod (name) {
		Class.prototype[name] = function () {
			return el[name].apply(el, arguments);
		};
	}
	copyMethod('addEventListener');
	copyMethod('removeEventListener');
	copyMethod('dispatchEvent');
}

function clone (data) {
	return JSON.parse(JSON.stringify(data));
}

return {
	mixinEventTarget: mixinEventTarget,
	clone: clone
};
})();