sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project1011.controller.Main", {
            onInit: function () {
                // var oData = {
                //     chartDataset : [
                //         { year : '2020', priceSum : '1000' },
                //         { year : '2021', priceSum : '2000' },
                //         { year : '2022', priceSum : '1200' },
                //         { year : '2023', priceSum : '2500' }
                //     ]
                // }

                // this.getView().setModel(new JSONModel(oData), "chart");

                // 위와 같은 데이터가 있을 때, 연도별 합계를 한눈에 확인할 수 
                // 있도록 세로 막대 차트를 구현하시오.
            }
        });
    });
