sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1016.controller.Main", {
            onInit: function () {
                

                
            },
            setImageUrl: function(sValue) {
                return `${_rootPath}/image/${sValue}.jpg`;
            }
        });
    });
