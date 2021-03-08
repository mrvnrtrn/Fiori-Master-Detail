sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, History, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("com.tosyali.masterdetailZMT_MASTERD.controller.Detail", {

		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("Detail").attachPatternMatched(this.onObjectMatched, this);
			// bu kısımda onObjectMatched in çalışması sağlanıyor.
		},
		onObjectMatched: function(oEvent) {
			var Pernr = oEvent.getParameter("arguments").Pernr;
			//buradaki Pernr router daki {Pernr} kısmı aynı olmalı
			this.getView().bindElement({
				path: "/PerMasterSet('" + Pernr + "')"
			});
		},
		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("Master");
			}
		},
		onEditGemiTanim: function() {
			this.getOwnerComponent().getModel("appModel").setProperty("/mode", "edit");
			var sObjectPath = this.getView().getElementBinding().getPath(); ///this.getView().getBindingContext().getPath();
			this.getOwnerComponent().getRouter().getTargets().display("Create_Edit", {
				sPath: sObjectPath
			});
		},
		onDeleteGemiTanim: function() {
			var that = this;
			MessageBox.show("Silmek istediğinize emin misiniz?", {
				icon: "sap-icon://question-mark",
				title: "Uyarı",
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				onClose: function(oAction) {
					if (oAction === MessageBox.Action.OK) {
						var sPath = that.getView().getElementBinding().getPath();

						that.getOwnerComponent().getModel().remove(sPath, {
							success: function(data) {
								MessageToast.show("işlem başarılı..");
								that.getOwnerComponent().getModel("appModel").setProperty("/firstRun", "1");
							},
							error: function(err) {
								MessageBox.error(JSON.parse(err.responseText).error.message.value);
							}
						});
					}
				}
			});

		},
		OnPressYeniEtEkle: function(oControlEvent) {
			if (!this._oMessagePopover01) {
				var key = this.getView().byId('tab').getSelectedKey();
				if (key == 1) {

					this._oMessagePopover01 = sap.ui.xmlfragment("com.tosyali.masterdetailZMT_MASTERD.view.fragments.Create_PopUp", this);
					//this.getView().addDependent(this._oMessagePopover01);
					this._oMessagePopover01.setModel(this.getView().getModel());
				} else {
					this._oMessagePopover01 = sap.ui.xmlfragment("com.tosyali.masterdetailZMT_MASTERD.view.fragments.Create_PopUp1", this);
					//this.getView().addDependent(this._oMessagePopover01);
					this._oMessagePopover01.setModel(this.getView().getModel());
				}
			}
			this._oMessagePopover01.open();
			var oDialog = new sap.ui.commons.Dialog({
				content: [],
				height: "200px",
				width: "200px",
				buttons: [new sap.ui.commons.Button({
					text: "OK",
					press: function() {
						oDialog.close();
					}
				})]
			});
		},

		onSave: function(oEvent) {
			var oDateFormat = sap.ui.core.format.DateFormat
				.getDateTimeInstance({
					pattern: "yyyy-MM-ddThh:mm:ss"
				});
			var oEntry = {};
			var key = this.getView().byId('tab').getSelectedKey();
			if (key == 1) {
				var A = sap.ui.getCore().byId("idCb").getValue();
				oEntry.Pernr = A.split('-')[0];
				oEntry.Egitimadi = sap.ui.getCore().byId("idA").getValue();
				oEntry.Egitimtarihi = oDateFormat.format(new Date(sap.ui.getCore().byId("idT").getDateValue()));
/*				oEntry.Egitimsuresi = sap.ui.getCore().byId("idS").getValue();*/
				oEntry.Egitimveren = sap.ui.getCore().byId("idV").getValue();
				this.getOwnerComponent().getModel().create("/PerEgitimSet", oEntry, {
					success: function(data) {
						MessageToast.show("Kayıt işlemi başarılı..");
					},
					error: function(err) {
						MessageBox.error(JSON.parse(err.responseText).error.message.value);
					}
				});
			} else {
				var oDateFormat = sap.ui.core.format.DateFormat
					.getDateTimeInstance({
						pattern: "yyyy-MM-ddThh:mm:ss"
					});
				var A = sap.ui.getCore().byId("idCb").getValue();
				oEntry.Pernr = A.split('-')[0];
				oEntry.Izinbittarihi = oDateFormat.format(new Date(sap.ui.getCore().byId("idT").getDateValue()));
				oEntry.Izingunsayisi = sap.ui.getCore().byId("idA").getValue();
				oEntry.Izinturu = sap.ui.getCore().byId("idV").getValue();
				this.getOwnerComponent().getModel().create("/PerIzinSet", oEntry, {
					success: function(data) {
						MessageToast.show("Kayıt işlemi başarılı..");
					},
					error: function(err) {
						MessageBox.error(JSON.parse(err.responseText).error.message.value);
					}
				});
			}
		},
		onClose: function() {
			this._oMessagePopover01.close();
			this._oMessagePopover01.destroy();
			this._oMessagePopover01 = null; //önemli.
		},
		onExit: function() {
			if (this._oMessagePopover01) {
				this._oMessagePopover01.destroy();
			}
		}

	});

});