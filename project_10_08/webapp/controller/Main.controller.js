sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var i = 0;
        return Controller.extend("project1008.controller.Main", {
            onInit: function () {
                var oData = {
                    list : []
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(oModel);
            },
            onAdd: function () {
                var oModel = this.getView().getModel();
                // var aList = oModel.getData().list;
                var aList = oModel.getProperty("/list");

                aList.push({
                    "name" : "hihi",
                    age : i
                });
                i++;

                oModel.setProperty("/list", aList);
                // oModel.setData({ list : aList }, true);

            },
            onDelete: function () {
                var TableIndices = this.byId("idTable").getSelectedIndices();
                var aList = this.getView().getModel().getProperty("/list");


                for(var i=TableIndices.length-1; i>=0; i--){
                    aList.splice(TableIndices[i], 1);
                }

                this.getView().getModel().setProperty("/list", aList);
                
            },
            onRowDelete: function(oEvent) {
                // 해당 모델의 index 구하기
                var index = oEvent.getParameters().row.getIndex();
                var aList = this.getView().getModel().getProperty("/list");

                // 해당 index의 모델 데이터 삭제
                aList.splice(index, 1);

                this.getView().getModel().setProperty("/list", aList);
            }
        });
    });
