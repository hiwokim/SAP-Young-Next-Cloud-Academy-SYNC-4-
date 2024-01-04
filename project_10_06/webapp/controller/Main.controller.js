sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("project1006.controller.Main", {
            onInit: function () {

            },
            HelloButtonPress: function() {
                sap.m.MessageToast.show('Fragment 버튼클릭');
            },
            onOpenDialog: function() {
                this.byId("idDialog").open();
            },
            // Button의 press 이벤트
            // 이벤트 함수는 이벤트 객체 oEvent 받아옴
            onClose: function(oEvent) {
                // getSource(), getParameters() ...

                
                // this.byId("idDialog").close();
                //  => View 안에서 호출한 팝업 닫기
                // sap.ui.getCore().byId("idDialog").close();
                //  => Controller 안에서 파일 로드한 팝업 닫기
                // 두 버전의 "팝업 닫기"를 통일하여 사용하려면? oEvent 활용

                // oEvent.getSource() 하면, 이벤트를 일으킨 객체가 리턴됨 => 버튼
                // 버튼에서 .getParent() 하면, 상위 객체 Dialog를 가져올 수 있음
                // 따라서 Dialog 에서 .close() 실행 시 팝업이 닫힘
                // id가 달라도 가능
                oEvent.getSource().getParent().close();
            },
            // Contorller 내에서 Dialog Fragment 호출하기
            onOpenDialog_con: function() {
                var dialog = sap.ui.getCore().byId("idDialog");
                if(!dialog){
                    Fragment.load({
                        name : "project1006.view.fragment.Dialog",
                        type : "XML",
                        controller : this
                    }).then(function(oDialog) {
                        oDialog.open();
                    });
                }else{
                    dialog.open();
                }      
            },

            onOpenDialog_Name: function() {
                var dialog = sap.ui.getCore().byId("NameDialog");
                if(!dialog){
                    Fragment.load({
                        name : "project1006.view.fragment.Name",
                        type : "XML",
                        controller : this
                    }).then(function(oDialog) {
                        oDialog.open();
                    });
                }else{
                    dialog.open();
                }      
            }
        });
    });
