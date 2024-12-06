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
	},
	//RAL color codes according to https://de.wikipedia.org/wiki/RAL-Farbe
	{
		type: 'extra',
		label: 'RAL Yellow/beige',
		colors: [
			//1000-1005
			'#cdba88', '#d0b084', '#d2aa6d', '#f9a800', '#e2b007', '#cb8e00',
			//1006-1007, 1011-1014
			'#e29000', '#e88c00', '#af8a54', '#d9c022', '#e3d9c6', '#ddc49a',
			//1015-1020
			'#e6d2b5', '#eaf044', '#f4b752', '#f3e03b', '#a4957d', '#9a9464',
			//1021, 1023-1024, 1026-1028
			'#f6b600', '#f7b500', '#b89c50', '#ffff00', '#a38c15', '#ff9b00',
			//1032-1037
			'#e2a300', '#faab21', '#edab56', '#a29985', '#927549', '#eea205'
		]
	},
	{
		type: 'extra',
		label: 'RAL Orange',
		colors: [
			//2000-2005
			'#da6e00', '#ba481b', '#c63927', '#fa842b', '#e75b12', '#ff4912',
			//2007-2012
			'#ffa421', '#ed6b21', '#e15501', '#d4652f', '#e26e0e', '#db6a50',
			//2013, 2017
			'#954527', '#fa4402'
		]
	},
	{
		type: 'extra',
		label: 'RAL Red',
		colors: [
			//3000-3005
			'#a72920', '#9b2423', '#9b2321', '#861a22', '#6b1c23', '#59191f',
			//3007, 3009, 3011-3014
			'#3e2022', '#6d332c', '#7e292c', '#cb8d73', '#9c322e', '#d47479',
			//3015-3018, 3020, 3022
			'#d79fa6', '#ac4034', '#d3545f', '#d14152', '#bb1e10', '#cc6855',
			//3024, 3026-3028, 3031-3032
			'#ff2d21', '#ff0000', '#b42041', '#cc2c24', '#a63437', '#711521',
			//3033
			'#b24c43'
		]
	},
	{
		type: 'extra',
		label: 'RAL Violet',
		colors: [
			//4001-4006
			'#8a5a83', '#933d50', '#c45f8c', '#691639', '#83639d', '#992572',
			//4007-4012
			'#4a203b', '#884d84', '#a38995', '#c63678', '#8773a1', '#6b6880'
		]
	},
	{
		type: 'extra',
		label: 'RAL Blue',
		colors: [
			//5000-5005
			'#384e6f', '#0f4c64', '#00387b', '#2a3756', '#191e28', '#005387',
			//5007-5012
			'#41678d', '#313c48', '#2e5978', '#004f7c', '#1a2b3c', '#3481b8',
			//5013-5015, 5017-5019
			'#193153', '#6c7c98', '#2874b2', '#005a8c', '#21888f', '#005e83',
			//5020-5025
			'#0b4151', '#07737a', '#222d5a', '#4d668e', '#6a93b0', '#296478',
			//5026
			'#102c54'
		]
	},
	{
		type: 'extra',
		label: 'RAL Green',
		colors: [
			//6000-6005
			'#3c7460', '#366735', '#325928', '#50533c', '#024442', '#114232',
			//6006-6011
			'#3c392e', '#2c3222', '#37342a', '#27352a', '#4d6f39', '#6c7c59',
			//6012-6017
			'#303d3a', '#7d765a', '#474135', '#3d3d36', '#00694c', '#587f40',
			//6018-6022, 6024
			'#61993b', '#b9ceac', '#37422f', '#8a9977', '#3a3327', '#008351',
			//6025-6029, 6032
			'#5e6e3b', '#005f4e', '#7ebab5', '#315442', '#006f3d', '#237f52',
			//6033-6038
			'#46877f', '#7aacac', '#194d25', '#04574b', '#008b29', '#00b51a',
			//6039
			'#b3c53f'
		]
	},
	{
		type: 'extra',
		label: 'RAL Grey',
		colors: [
			//7000-7005
			'#7a888e', '#8f999f', '#817863', '#7a7669', '#9b9b9b', '#6b716f',
			//7006, 7008-7012
			'#756f61', '#745e3d', '#5d6058', '#585c56', '#555d61', '#575d5e',
			//7013, 7015-7016, 7021-7023
			'#575044', '#575044', '#51565c', '#383e42', '#4b4d46', '#818479',
			//7024, 7026, 7030-7033
			'#474a50', '#374244', '#939388', '#5b686d', '#b5b0a1', '#818979',
			//7034-7039
			'#91886f', '#cbd0cc', '#9a9697', '#7a7b7a', '#b4b8b0', '#6b685e',
			//7040, 7042-7046
			'#9ba3a6', '#8f9695', '#4e5451', '#bdbdb2', '#8d9194', '#82898e',
			//7047-7048
			'#cfd0cf', '#888175'
		]
	},
	{
		type: 'extra',
		label: 'RAL Brown',
		colors: [
			//8000-8004, 8007
			'#89693e', '#99622d', '#794d3e', '#7e4b26', '#8f4e35', '#6f4a2f',
			//8008, 8011-8012, 8014-8016
			'#6e4a23', '#5a3a29', '#66332b', '#4a3526', '#633a34', '#492a1f',
			//8017, 8019, 8022-8025
			'#442f29', '#3f3a3a', '#211f20', '#a65e2f', '#765038', '#755c49',
			//8028-8029
			'#4e3b2b', '#773c27'
		]
	},
	{
		type: 'extra',
		label: 'RAL White/Black',
		colors: [
			//9001-9006
			'#e9e0d2', '#d7d5cb', '#f4f8f4', '#2e3032', '#0e0e10', '#a1a1a0',
			//9007, 9010-9012, 9016-9017
			'#878683', '#878683', '#f7f9ef', '#fffde6', '#f7fbf5', '#2a2d2f',
			//9018, 9022-9023
			'#c7cac3', '#9c9c9c', '#7e8182'
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

function removeCollectionFromStore (label) {
	var i;
	for (i = 0; i < storedCollections.length; i++) {
		if (storedCollections[i].label === label) {
			storedCollections.splice(i, 1);
			return;
		}
	}
}

function getByType (type) {
	return util.clone(combinedCollections.filter(function (entry) {
		return entry.type === type;
	}));
}

function getNotCollections () {
	return util.clone(combinedCollections.filter(function (entry) {
		return entry.type !== 'current' && entry.type !== 'collection';
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
	getMore: getNotCollections,
	getByLabel: function (label) {
		var i;
		for (i = 0; i < combinedCollections.length; i++) {
			if (combinedCollections[i].label === label) {
				return util.clone(combinedCollections[i].colors);
			}
		}
	},
	storePalette: function (label, colors) {
		addCollectionToStore(label, 'palette', colors);
		storeCollections();
		combineCollections();
	},
	removePalette: function (label) {
		removeCollectionFromStore(label);
		storeCollections();
		combineCollections();
	}
};

})();