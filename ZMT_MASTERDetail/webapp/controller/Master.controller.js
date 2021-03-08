sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.tosyali.masterdetailZMT_MASTERD.controller.Master", {
	onInit: function() {

			this.getOwnerComponent().getModel("appModel").setProperty("/firstRun","1");
		},
		onSearch: function(oEvent) {
			var val = oEvent.getSource().getProperty("value");
			var oFilter = new sap.ui.model.Filter("Adi", sap.ui.model.FilterOperator.Contains, val);

			this.getView().byId("idList").getBinding("items").filter([oFilter]);
		},
		onSelectionChange: function(oEvent) {
			var myPernr = oEvent.getSource().getProperty("title").split('-')[1].trim();

			this.getOwnerComponent().getRouter().navTo("Detail", {
				Pernr: myPernr
					//soldaki Imono routerdaki {Imono} nasılsa öyle olmalı.
			});
		},
		onUpdateFinished: function(oEvent) {
			var firstRun = this.getOwnerComponent().getModel("appModel").getProperty("/firstRun");
			var isPhone = this.getOwnerComponent().getModel("device").getData().system.phone;
			if (firstRun === "1" && !isPhone) {
				var items = oEvent.getSource().getItems();
				if (items && items.length > 0) {
					var firstPernr = items[0].getBindingContext().getProperty("Pernr");
					this.getOwnerComponent().getRouter().navTo("Detail", {
						Pernr: firstPernr
							//soldaki Imono routerdaki {Imono} nasılsa öyle olmalı.
					});
					this.getOwnerComponent().getModel("appModel").setProperty("/firstRun","2");
				}else{
					this.getOwnerComponent().getRouter().getTargets().display("NotFound");
				}
			}
		},
		onCreateGemiTanim: function(){
			this.getOwnerComponent().getModel("appModel").setProperty("/mode","create");
			this.getOwnerComponent().getRouter().getTargets().display("Create_Edit");
		}

	});

});