/*global storedCollection: true*/
/*global util*/
storedCollection =
(function () {
"use strict";

var defaultCollections = [
	{
		type: 'current',
		label: '',
		colors: ['#ff0000']
	},
	{
		type: 'palette',
		label: 'Light',
		colors: ['#ffffff', '#222222', '#72777d', '#9a373b', '#2b55ab']
	},
	{
		type: 'palette',
		label: 'Dark',
		colors: ['#222222', '#c8ccd1', '#a2a9b1', '#db9c9e', '#91ade4']
	},
	{
		type: 'palette',
		label: 'Sepia',
		colors: ['#f4ecd8', '#5b4636', '#676c71', '#883134', '#264b97']
	},
	{
		type: 'collection',
		label: 'Black and White',
		colors: ['#000000', '#444444', '#888888', '#cccccc', '#ffffff']
	},
	{
		type: 'collection',
		label: 'Basic',
		colors: [
			'#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff',
			'#880000', '#008800', '#000088', '#888800', '#008888', '#880088'
		]
	}
], storedCollections, combinedCollections;

function combineCollections () {
	var i, j;
	combinedCollections = util.clone(defaultCollections);
	fori: for (i = 0; i < storedCollections.length; i++) {
		for (j = 0; j < combinedCollections.length; j++) {
			if (storedCollections[i].label === combinedCollections[j].label) {
				combinedCollections[j] = storedCollections[i];
				continue fori;
			}
		}
		combinedCollections.push(storedCollections[i]);
	}
}

function loadCollections () {
	try {
		storedCollections = JSON.parse(localStorage.getItem('colors-collections') || '[]');
	} catch (e) {
		storedCollections = [];
	}
	combineCollections();
}

function storeCollections () {
	try {
		localStorage.setItem('colors-collections', JSON.stringify(storedCollections));
	} catch (e) {
	}
}

function addCollectionToStore (label, type, colors) {
	var i;
	for (i = 0; i < storedCollections.length; i++) {
		if (storedCollections[i].label === label) {
			storedCollections[i].type = type;
			storedCollections[i].colors = colors;
			return;
		}
	}
	storedCollections.push({
		label: label,
		type: type,
		colors: colors
	});
}

function getByType (type) {
	return util.clone(combinedCollections.filter(function (entry) {
		return entry.type === type;
	}));
}

loadCollections();

return {
	getCurrent: function () {
		return getByType('current')[0].colors;
	},
	setCurrent: function (colors) {
		addCollectionToStore('', 'current', colors);
		storeCollections();
		combineCollections();
	},
	getPalettes: function () {
		return getByType('palette');
	},
	getCollections: function () {
		return getByType('collection');
	},
	getByLabel: function (label) {
		var i;
		for (i = 0; i < combinedCollections.length; i++) {
			if (combinedCollections[i].label === label) {
				return util.clone(combinedCollections[i].colors);
			}
		}
	}
};

})();