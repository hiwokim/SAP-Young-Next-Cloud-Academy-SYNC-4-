sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("odata.project1009.controller.Detail", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
            },
            // 해당 타켓 화면이 표시될때마다 이벤트 실행
            _onPatternMatched:function(oEvent){
                var oArgu = oEvent.getParameters().arguments;

                // this.byId('OrderID').setText(oArgu.OrderID);

                // "/EntitySetName(key='1', key2='2')"
                // "/EntitySetName('1')"
                // "/Orders(10248)"
                this.byId("idForm").bindElement(`/Orders(${oArgu.OrderID})`);
            },
            onNavBack: function(){
                this.oRouter.navTo('RouteMain');
            }
        });
    });
