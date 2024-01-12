sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1012.controller.Employee", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();

                var oTarget = this.oRouter.getTarget("TargetEmployee");
                oTarget.attachDisplay(this._onAttachDisplay, this);
            },
            // 해당 타켓 화면이 표시될때마다 이벤트 실행
            _onAttachDisplay:function(oEvent){
                this._oData = oEvent.getParameter("data");
            },
            onNavBack: function(){
                this.oRouter.navTo('RouteMain', {});
            }
        });
    });
