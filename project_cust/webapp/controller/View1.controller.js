sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel", // JSONModel 추가
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, ODataModel, Filter, FilterOperator, MessageToast) {
    "use strict";
    var Mdata;
    var Sdata;
    return Controller.extend("sync.projectcust.controller.View1", {
        onInit: function () {
            var oDataModel = new ODataModel("/sap/opu/odata/sap/ZGW_ZBC10_SRV/", true);
            var oView = this.getView();

            oDataModel.read("/ZBCT_CUSTSet", {
                success: function(oData) {
                    // JSON 모델에 데이터 설정
                    var oJSONModel = new JSONModel(oData);
                    oView.setModel(oJSONModel);
                    Mdata = oData.results;

                    // 테이블에 바인딩 설정
                    var oTable = oView.byId("customerTable");
                    oTable.setModel(oJSONModel);
                    oTable.bindItems({
                        path: "/results",
                        template: new sap.m.ColumnListItem({
                            cells: [
                                new sap.m.ObjectIdentifier({ text: "{PartnerId}" }),
                                new sap.m.Text({ text: "{PartnerName}" }),
                                new sap.m.Text({ text: "{Crnum}" }),
                                new sap.m.Text({ text: "{Telno}" }),
                                new sap.m.Text({ text: "{Address}" }),
                                new sap.m.Text({ text: "{Matnr}" }),
                                new sap.m.Text({ text: "{Manam}" }),
                                new sap.m.Image({ src: "webapp/img/br1.jpg", width: "auto", height: "auto" }),
                                new sap.m.RatingIndicator({ value: "{Rating}", iconSize: "1rem" })
                            ]
                        })
                    });
                },
                error: function(oError) {
                    MessageToast.show("Error loading data");
                }
            });
        },

        onImportVendorFilter: function() {
            this.onFilterByMatnr("RM");
        },

        onDomesticVendorFilter: function() {
            this.onFilterByMatnr("PM");
        },

        onCustomerFilter: function() {
            this.onFilterByMatnr("FG");
        },

        onAllFilter: function() {
            this.onFilterByMatnr("ALL");
        },

        onFilterByMatnr: function(matnr) {
            if (matnr === "ALL") {
                Sdata = Mdata;
            } else {
                Sdata = Mdata.filter(function(item) {
                    return item.Matnr.startsWith(matnr);
                });
            }

            // 필터링된 데이터를 JSON 모델에 설정
            var oFilteredModel = new JSONModel({ results: Sdata });
            this.getView().setModel(oFilteredModel, "filteredModel");

            // 테이블에 필터링된 데이터 바인딩
            var oTable = this.getView().byId("customerTable");
            oTable.setModel(oFilteredModel, "filteredModel");
            oTable.bindItems({
                path: "filteredModel>/results",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.ObjectIdentifier({ text: "{filteredModel>PartnerId}" }),
                        new sap.m.Text({ text: "{filteredModel>PartnerName}" }),
                        new sap.m.Text({ text: "{filteredModel>Crnum}" }),
                        new sap.m.Text({ text: "{filteredModel>Telno}" }),
                        new sap.m.Text({ text: "{filteredModel>Address}" }),
                        new sap.m.Text({ text: "{filteredModel>Matnr}" }),
                        new sap.m.Text({ text: "{filteredModel>Manam}" }),
                        new sap.m.Image({ src: "{filteredModel>ImageUrl}", width: "50px", height: "50px" }),
                        new sap.m.RatingIndicator({ value: "{filteredModel>Rating}", iconSize: "1rem" })
                    ]
                })
            });
        }
    });
});
