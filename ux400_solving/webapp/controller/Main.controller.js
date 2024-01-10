sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.ux400solving.controller.Main", {
            onInit: function () {
                this.getView().setModel(new JSONModel( { history : [] } ),"list");

            },
            onRandomPress: function () {
                this.byId("oInput").setValue(Math.floor(Math.random() * 100) + 1);
                var value = this.byId("oInput").getValue();
                var oModel = this.getView().getModel("list");
                var Mdata = oModel.getData();
                
                Mdata.history.push({ rosw : value });
                oModel.setData(Mdata);
            },
            openProduct: function (){
                this.getView().byId("idDialog").open();
            },
            onClose: function(oEvent) {
                oEvent.getSource().getParent().close();
            },
            transformDiscontinued: function(sValue){
                debugger;
                if(sValue){
                    if(sValue == true){
                        return 'Yes';
                    }else{
                        return 'No';
                    }
                }
            }
        });
    });
