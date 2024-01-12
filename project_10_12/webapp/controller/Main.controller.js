sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1012.controller.Main", {
            onInit: function () {
                // 한 단계 위에 있는 컴포넌트에 접근해서, 라우터를 가져온다
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute('RouteMain').attachPatternMatched(this._onPatternMatched, this);
            },
            _onPatternMatched: function(oEvent) {
                // var oArgu = oEvent.getParameter().arguments;
                var oArgu = oEvent.getParameter('arguments'); // 위와 동일

                // oArgu["?query"].test; //'10'
                
                // console.log("Main : ", oArgu["?query"].test);
            },
            onGoDetail: function() {
                this.oRouter.navTo('RouteDetail', {
                    key1 : 'okok',
                    key2 : 123
                }, true);
                // .navTo('라우트객체이름', {파라미터정보}, 라우터 히스토리 초기화)
            },
            onGoNotFound: function() {
                this.oRouter.getTargets().display("NotFound", {
                    fromTarget : 'TargetMain'
                });
            },
            onGoEmployee: function(){
                this.oRouter.navTo('RouteEmployee', {}, true);
            }
        });
    });
