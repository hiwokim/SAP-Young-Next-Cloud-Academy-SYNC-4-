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
            },
            onGoDetail: function() {
                this.oRouter.navTo('RouteDetail', {}, true);
                // .navTo('라우트객체이름', {파라미터정보}, 라우터 히스토리 초기화)
            }
        });
    });
