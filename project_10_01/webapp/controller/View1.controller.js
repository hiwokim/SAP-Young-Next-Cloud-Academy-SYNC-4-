sap.ui.define([
    "sap/ui/core/mvc/Controller", //api 가져오기
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";
        // 클로저 변수(전역 변수)
        // var TEST = "okok";

        return Controller.extend("project1001.controller.View1", {
            onInit: function () {
                //new sap.m.Button
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
                    title : {
                        subTitle : 'Calculator Program'
                    },
                    items : [
                        { key : "plus", text : "+"},
                        { key : "minus", text : "-"},
                        { key : "multiple", text : "*"},
                        { key : "divide", text : "/"}
                    ]
                };
                this.getView().setModel(new JSONModel(oData)); 
                // 이름없는 기본모델의 경우, 경로만 작성해주면 된다.
                this.byId("idTitle").bindElement('/');

                // 이름이 있는 모델의 경우, 경로 및 이름을 객체 형태로 전달한다.
                // this.byId("idTitle").bindElement({
                //     path : '/title',
                //     model : 'main1'
                // });
                this.byId("test").bindElement('/')
                this.getView().setModel(new JSONModel( { history : [] } ),"local");
                
            },
            // local 모델의 result 값에 따라서
            // 포멧터 함수를 적용할 수 있다.
            // result 값이 100 초과면 초록색, 아니면 빨각색을 반환한다.
            fnColorFormat: function(sValue){
                if(sValue){
                    if(sValue > 100){
                        return '#47C83E';
                    } else{
                        return '#FFBB00';
                    }
                }
            },

            onBeforRendering : function () {/*화면 그려지기 전 실행*/},
            onAfterRendering : function () {/*화면 그려진 후 실행*/},
            onExit: function() {/*화면 종료되면 실행*/},
            
            onClick: function () {
                //View에 있는 Input 객체를 가져온다
                var oInput1 = this.byId("idInput1").getValue();
                var oInput2 = this.byId("idInput2").getValue();
                var oModel = this.getView().getModel("local");
                var Mdata = oModel.getData();
                
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

                switch(sOperator){
                    case "+":
                        result = oInput1 + oInput2;
                        break;
                    case "-":
                        result = oInput1 - oInput2;
                        break;
                    case "*":
                        result = oInput1 * oInput2;
                        break;
                    case "/":
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
                Mdata.history.push({ num1 : oInput1, oper : sOperator, num2 : oInput2, result : result });
                // this.getView().setModel(new JSONModel(Mdata),"local");
                oModel.setData(Mdata);
                
                //this : Controller
                //.getView() : Controller 에 있는 메서드
                //.byId() : View 에 있는 메서드
                //.getValue() : input에 있는 메서드

            }
        });
    });
    
