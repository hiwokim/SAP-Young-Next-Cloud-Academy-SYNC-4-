sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, JSONModel) {
        "use strict";

        return Controller.extend("exam.exprogram10.controller.Main", {
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                this.getView().setModel(new JSONModel({
                    Conditions : {},
                    LocalProducts : [],
                    LocalChart : []
                }), 'main');

                oRouter.getRoute('RouteMain').attachPatternMatched(this.onPatternMatched, this);

            },
            _onPatternMatched: function () {
                this.getView().getModel('main').setData({
                    Conditions : {},
                    LocalProducts : [],
                    LocalChart : []
                });

                this.byId("idTable").removeSelections();
            },
            onSearch: function () {
                const oTable = this.byId("idTable"),
                      oMainModel = this.getView().getModel('main');
                let oCondition = oMainModel.getData().Conditions,
                    aFilter = [];

                if (oCondition.CategoryID) {
                    aFilter.push(new Filter({
                        path: 'CategoryID',
                        operator: 'GE',
                        value1: oCondition.CategoryID,
                        value2: ''

                    }));
                }
                if (oCondition.CategoryName) {
                    aFilter.push(new Filter({
                        path: 'CategoryName',
                        operator: 'Contains',
                        value1: oCondition.CategoryName,
                        value2: ''
                    }));
                }

                oTable.getBinding("items").filter(aFilter);
                oTable.removeSelections();
                
                oMainModel.setProperty("/LocalProducts", []);
                oMainModel.setProperty("/LocalChart", []);
            },
            onSelectionChange: function (oEvent) {
                var sPath = oEvent.getParameters().listItem.getBindingContextPath();
                var oSelectData = this.getView().getModel().getProperty(sPath);
                var oMainModel = this.getView().getModel('main');
                var oFilter = new Filter('CategoryID', 'EQ', oSelectData.CategoryID);
                
                this.getView().getModel().read("/Products", {
                    filters : [oFilter],
                    success: function(oReturn) {
                        oMainModel.setProperty("/LocalProducts", oReturn.results);
                    }
                });
                
                this.getView().getModel().read("/Sales_by_Categories", {
                    filters : [oFilter],
                    success: function(oReturn) {
                        oMainModel.setProperty("/LocalChart", oReturn.results);
                    }
                });
            },
            OselectData: function (oEvent) {
                var ProductNamedata = oEvent.getParameters().data[0].data.ProductName;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo('RouteDetail', {
                    ProductName: ProductNamedata
                });
            }
        });
    });
