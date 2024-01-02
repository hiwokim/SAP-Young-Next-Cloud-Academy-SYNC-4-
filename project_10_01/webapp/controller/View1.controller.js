sap.ui.define([
    "sap/ui/core/mvc/Controller", //api 가져오기
    "sap/m/Button"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Button) {
        "use strict";

        return Controller.extend("project1001.controller.View1", {
            onInit: function () {
                //new sap.m.Button
                new Button
                //초기화 함수
                //초기값 설정, 화면에서 사용할 모델 생성
                //아래 함수들이 사용할 공통 변수 등을 세팅
            },

            onBeforRendering : function () {/*화면 그려지기 전 실행*/},
            onAfterRendering : function () {/*화면 그려진 후 실행*/},
            onExit: function() {/*화면 종료되면 실행*/},
            
            onClick: function () {
                //View에 있는 Input 객체를 가져온다
                var oinput = this.getView().byId("idInput1").getValue();
               
                var result;
                alert(plus);
                //this : Controller
                //.getView() : Controller 에 있는 메서드
                //.byId() : View 에 있는 메서드
                //.getValue() : input에 있는 메서드

            }
        });
    });
    
