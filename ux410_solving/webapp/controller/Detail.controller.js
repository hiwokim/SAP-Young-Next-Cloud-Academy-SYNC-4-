sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Detail", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
                
            },
            _onPatternMatched:function(oEvent){
                var oArgu = oEvent.getParameters().arguments;
                this.byId("uxID").setObjectTitle("OrderID : "+oArgu.OrderID);
                this.byId("SimpleFormId").bindElement(`/Order_Details(OrderID=${oArgu.OrderID},ProductID=${oArgu.ProductID})`);
            },
            onNavBack: function(){
                this.oRouter.navTo('RouteMain');
            }
        });
    });
