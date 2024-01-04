sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1006.controller.HelloPanel", {
            onInit: function () {

            },
            onShowHello: function() {
                sap.m.MessageToast.show('버튼클릭');
                this.byId("oInput").setValue("안녕하세요");
            }
        });
        
    });
