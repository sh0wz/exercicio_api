/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"vdlcombr/exercicio_api/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
