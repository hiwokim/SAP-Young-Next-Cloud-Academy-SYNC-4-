sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project1007.controller.Main", {
            onInit: function () {
                // var oData = { 
                //     name : "Hong Gil Dong",
                //     age : 20,
                //     title : "Gildong's Page"
                // };
                // var oModel = new JSONModel(oData);

                // var oData = { 
                //     name : {
                //         firstName : "Hong",
                //         lastName : "Gildong"
                //     },
                //     datas : [
                //         { name : 'Kim', age : 30, tel : '010-2222-6811' },
                //         { name : 'Park', age : 10, tel : '010-3333-1321' },
                //         { name : 'Moon', age : 20, tel : '010-5555-8621' }
                //     ]
                // };
                // var oModel = new JSONModel(oData);

                
                   
                var oModel = new JSONModel();
                oModel.loadData("../model/test.json"); 

                var oModel2 = new JSONModel();
                oModel2.loadData("../model/data.json"); 
                   
                // var oModel = new JSONModel();
                // oModel.loadData("../model/data.json", {}, false); 

                //  View에 JSON 모델(이름 없음=기본 모델=Default Model)을 세팅한다.
                this.getView().setModel(oModel,"test"); 
                this.getView().setModel(oModel2); 

                //console.log(oModel.getData());

                //  car 라는 이름의 모델
                // this.getView().setModel(oModel2, "car");
            },
            Onclick : function(){
                // var oModel = this.getView().getModel('test');

                // var data = oModel.getData();
                // var data2 = oModel.getProperty("/name");
                // var data = oModel.setData({name : "홍길동" });
                
                // oModel.setProperty("/name/firstName", "Park");
                // console.log(oModel.getData());
                
                // var oModel = this.getView().getModel('test');
                // oModel.getData().history; // 전체 데이터 가져오기
                // oModel.getProperty('/history') // 특정 경로에 있는 데이터 가져오기 "/"는 전체 경로
                
                // oModel.setData("바꿀 데이터","합치기 여부(true, false)");
                // oModel.setProperty("/경로", "바꿀값");
            },
            OnSetData : function(oEvent){
                var oModel = this.getView().getModel(); //기본모델 호출
                var oTestModel = this.getView().getModel("test");
                var sInputData = oModel.getProperty("/inpValue");

                //oTestModel.setProperty("/textValue", "Hello "+sInputData);
                oTestModel.setData({ textValue : "Hello "+sInputData});
                /*
                    oTestModel에 있는 textValue 데이터 변경

                    변경된 데이터 : "Hello + <Input 입력값>"

                    setProperty 또는 setData 사용해서 적용할 수 있음!
                */

            }
        });
    });
