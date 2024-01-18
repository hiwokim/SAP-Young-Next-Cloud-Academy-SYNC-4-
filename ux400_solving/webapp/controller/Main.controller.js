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
                if(sValue){
                    return 'Yes';
                }else{
                    return 'No';
                }
            },
            onValueChange: function(){
                var input = this.byId("oInput");
                var num = input.getValue();
                
                var oModel = this.getView().getModel("list");
                var Mdata = oModel.getData();
                
                if(num > 0 && num <= 100){
                    input.setValueState();
                    Mdata.history.push({ rosw : num });
                    oModel.setData(Mdata);
                }else{
                    input.setValueState("Error");
                    input.setValueStateText("1이상 100이하의 숫자를 입력해주세요.");
                }
            }
        });
    });