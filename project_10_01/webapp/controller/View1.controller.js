sap.ui.define([
    "sap/ui/core/mvc/Controller", //api 가져오기
    "sap/m/Button",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Button, JSONModel) {
        "use strict";

        return Controller.extend("project1001.controller.View1", {
            onInit: function () {
                //new sap.m.Button
                new Button
                //초기화 함수
                //초기값 설정, 화면에서 사용할 모델 생성
                //아래 함수들이 사용할 공통 변수 등을 세팅

                // this.byId("idInput1").setValue("10"); // 화면 뜨자마자 초기 세팅
                // this.byId("idInput2").setValue("20"); // 화면 뜨자마자 초기 세팅
                // this.getView().byId("idInput");
                // -> idInput 객체가 없다고 오류가 날 수 있음
                // -> 왜냐면, 화면이 아직 그려지기 전에 Init 함수가 실행해서
                //    타이밍이 맞지 않을 수 있기 때문
                // -> onAfterRendering 등 화면 그려진 후에 로직을 실행할 수 있도록 설정

                // this.getOwnerComponent().getModel()
                // -> Component 단으로 올라가기 위해서
                //    getOwnerComponent() 를 사용

                var oData = { 
                    items : [
                        { key : "plus", text : "+" ,additionalText : "Plus"},
                        { key : "minus", text : "-" ,additionalText : "Minus"},
                        { key : "multiple", text : "*" ,additionalText : "Multiple"},
                        { key : "divide", text : "/" ,additionalText : "Divide"}
                    ]
                };
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel); 
            },

            onBeforRendering : function () {/*화면 그려지기 전 실행*/},
            onAfterRendering : function () {/*화면 그려진 후 실행*/},
            onExit: function() {/*화면 종료되면 실행*/},
            
            onClick: function () {
                //View에 있는 Input 객체를 가져온다
                var oInput1 = this.byId("idInput1").getValue();
                var oInput2 = this.byId("idInput2").getValue();
                if(oInput1 == ""){ 
                    oInput1 = null; 
                }
                else{ 
                    oInput1 = Number(oInput1);
                }

                if(oInput2 == ""){
                    oInput2 = null;
                }
                else{
                    oInput2 = Number(oInput2);
                }
                
                var cal = this.byId("idSelect").getSelectedKey();
                var sOperator = this.byId("idSelect").getSelectedItem().getText();
                var result = 0;

                switch(cal){
                    case "plus":
                        result = oInput1 + oInput2;
                        break;
                    case "minus":
                        result = oInput1 - oInput2;
                        break;
                    case "multiple":
                        result = oInput1 * oInput2;
                        break;
                    case "divide":
                        result = oInput1 / oInput2;
                        break;
                }

                // switch(sOperator){
                //     case "+":
                //         result = oInput1 + oInput2;
                //         break;
                //     case "-":
                //         result = oInput1 - oInput2;
                //         break;
                //     case "*":
                //         result = oInput1 * oInput2;
                //         break;
                //     case "/":
                //         result = oInput1 / oInput2;
                //         break;
                // }
                if(oInput1 == null || oInput2 == null){
                    sap.m.MessageToast.show("값을 입력해주세요");    
                }else{
                    sap.m.MessageToast.show("답 : " + result);
                }
                    
                
                
                //this : Controller
                //.getView() : Controller 에 있는 메서드
                //.byId() : View 에 있는 메서드
                //.getValue() : input에 있는 메서드

            }
        });
    });
    
