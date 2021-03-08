sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/tosyali/masterdetailZMT_MASTERD/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("com.tosyali.masterdetailZMT_MASTERD.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			this.setModel(models.createDeviceModel(), "device");

			var jModel = new JSONModel();
			this.setModel(jModel, "appModel");

			this.getRouter().initialize();
		}
	});
});