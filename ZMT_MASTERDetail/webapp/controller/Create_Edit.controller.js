sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("com.tosyali.masterdetailZMT_MASTERD.controller.Create_Edit", {

		onInit: function() {
			this.oDataModel = this.getOwnerComponent().getModel();
			this.getOwnerComponent().getRouter().getTargets().getTarget("Create_Edit").attachDisplay(null, this._onDisplay, this);
		},
		_onDisplay: function(oEvent) {
			var mode = this.getOwnerComponent().getModel("appModel").getProperty("/mode");
			if (mode === "edit") {
				var oData = oEvent.getParameter("data");
				this.getView().bindElement({
					path: oData.sPath
				});
			}

		},

		onPressKaydetGuncelle: function() {

			var oEntry = {};
			oEntry.Pernr = this.getView().byId("idPernr").getValue(); //silme bu olmayınca edit boş gelmiyor.
			oEntry.Adi = this.getView().byId("idAdi").getValue();
			oEntry.Soyadi = this.getView().byId("idSoyadi").getValue();
			oEntry.Departman = this.getView().byId("idDepartman").getValue();
			var oDateFormat = sap.ui.core.format.DateFormat
				.getDateTimeInstance({
					pattern: "yyyy-MM-ddThh:mm:ss"
				});
			oEntry.Dogumtarihi =  oDateFormat.format(new Date(this.getView().byId("idDogT").getDateValue()));

			var that = this;

			var mode = this.getOwnerComponent().getModel("appModel").getProperty("/mode");
			if (mode === "create") {
				this.oDataModel.create("/PerMasterSet", oEntry, {
					success: function(data) {
						MessageToast.show("Kayıt işlemi başarılı..");
						that.getOwnerComponent().getRouter().navTo("Detail", {
							Pernr: data.Pernr
						});
					},
					error: function(err) {
						MessageBox.error(JSON.parse(err.responseText).error.message.value);
					}
				});
			} else {
				var sObjectPath = this.getView().getElementBinding().getPath();

				this.oDataModel.update(sObjectPath, oEntry, {
					success: function(data) {
						MessageToast.show("Güncelleme işlemi başarılı..");
						that.getOwnerComponent().getRouter().getTargets().display("Detail");
						//history.go(-1);
						// that.getOwnerComponent().getRouter().navTo("Detail", {
						// 	Pernr: oEntry.Pernr
						// });
					},
					error: function(err) {
						MessageBox.error(JSON.parse(err.responseText).error.message.value);
					}
				});
			}
		}

	});

});