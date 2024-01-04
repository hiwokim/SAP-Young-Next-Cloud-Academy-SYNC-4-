sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Button"
],  
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Button) {
        "use strict";
        return Controller.extend("sync.project1003.controller.Main", {
            onInit: function () {
                new Button
            },
            OnClick: function(){
                var input = this.byId("input").getValue(); 
                this.byId("result").setText(input);
            },
            clear: function(){
                this.byId("input").setValue(null)
                this.byId("result").setText(null);
            }
        });
    });