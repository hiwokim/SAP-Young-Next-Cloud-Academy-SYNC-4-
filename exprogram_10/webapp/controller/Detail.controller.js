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

        return Controller.extend("sap.btp.ux410solving.controller.Detail", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);

            },
            _onPatternMatched: function (oEvent) {
                var oArgu = oEvent.getParameters().arguments;
                var title = {
                    title: oArgu.ProductName + " 상품의 주문조회"
                }
                this.getView().setModel(new JSONModel(title), 'title');
                var aFilter = [];
                if (oArgu.ProductName) {
                    aFilter.push(new Filter({
                        path: 'ProductName',
                        operator: 'EQ',
                        value1: oArgu.ProductName,
                        value2: ''
                    }));
                }

                this.byId("idTable3").getBinding("items").filter(aFilter);
            },
            onNavBack: function () {
                this.oRouter.navTo('RouteMain');
            }
        });
    });
