sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";
        
        return Controller.extend("opdata.project1013.controller.Main", {
            onInit: function () {
                var oData = {
                    Productno: "11",
                    Productname: "11",
                    Fname: "11",
                    Lname: "11",
                    Memo: "11"
                }
                this.getView().setModel(new JSONModel(oData), 'data');
            },

            onRowSelectionChange: function(oEvent) {                    
                var sPath = oEvent.getParameter('rowContext').getPath(); //Product('1000')                                
                var oSelectData = this.getView().getModel().getProperty(sPath); //한 건의 model data - 모델경로로 해당 경로의 전체 데이터 얻음

                var oData = {
                    Productno: oSelectData.Productno,
                    Productname: oSelectData.Productname,
                    Fname: oSelectData.Fname,
                    Lname: oSelectData.Lname,
                    Memo: oSelectData.Memo
                };

                //data 모델 가져와서
                var oModel = this.getView().getModel("data");                
                //data 모델에 set
                oModel.setData(oData);                
                this.getView().setModel(oModel, "data");

                console.log('data 모델의 데이터: ',oModel.getData());

                // this.byId("idOrdersTable").bindElement({
                //         path: '/Products',
                //         model: 'data'
                // });
            

            },
            onReset: function(){
                var oModel = this.getView().getModel("data");                
                
                //data 모델에 set
                oModel.setData({
                    Productno: "",
                    Productname: "",
                    Fname: "",
                    Lname: "",
                    Memo: ""
                });                
                this.byId("idTable").clearSelection();
                this.getView().getModel().refresh(true);
               
            },
            onEntitySet: function(){
                // 전체 조회 구현
                // GET 요청 : "/Products"
                var oDataModel = this.getView().getModel();

                oDataModel.read("/Products", {
                    filters: [ /* 필터 객체 배열 */ ],
                    success: function(oReturn){
                        console.log("전체조회", oReturn);
                    },
                    error: function(oError){
                        console.log("전체조회 중 오류 발생 ", oError);
                    }
                });

            },
            onEntity: function(){
                // 데이터 한 건 조회
                // GET 요청 : "/Products(ProductNo='1')"
                var oDataModel = this.getView().getModel();
                var oJSONData = this.getView().getModel('data').getData();
                var sPath = oDataModel.createKey("/Products", {
                    Productno : oJSONData.Productno
                }); // sPath값 => "/Products('1000')"

                oDataModel.read(sPath, {
                    success: function(oReturn){
                        console.log("한건조회", oReturn);
                    },
                    error: function(oError){
                        console.log("한건조회 중 오류 발생 ", oError);
                    }
                });
            },
            onCreate: function(){
                // 데이터 생성 구현
                // POST 요청 : "/Products" + Body

                // 아래 코드 중 A || '' 의 뜻?
                // => A 값이 없으면(false), 빈 문자열을 넣어라

                var oDataModel = this.getView().getModel();
                var oJSONData = this.getView().getModel('data').getData();
                var oBody = {
                    Productno: oJSONData.Productno,
                    Productname: oJSONData.Productname || "",
                    Fname: oJSONData.Fname || "",
                    Lname: oJSONData.Lname || "",
                    Memo: oJSONData.Memo || ""
                };

                oDataModel.create("/Products", oBody, {
                    success: function(){
                        sap.m.MessageToast.show("데이터 생성 완료");
                    },
                    error: function(){
                        sap.m.MessageToast.show("데이터 생성 실패");
                    }
                });
            },
            onUpdate: function(){
                // 데이터 생성 구현
                // PUT 요청 : "/Products('1000')" + Body

                var oDataModel = this.getView().getModel();
                var oBody = this.getView().getModel('data').getData();
                var sPath = oDataModel.createKey("/Products", {
                    Productno : oBody.Productno
                });


                oDataModel.update(sPath, oBody, {
                    success: function(){
                        sap.m.MessageToast.show("데이터 업데이트 완료");
                    },
                    error: function(){
                        sap.m.MessageToast.show("데이터 업데이트 실패");
                    }
                });
            },

            onDelete: function(){
                // 데이터 삭제 구현
                // DELETE 요청 : "/Products('1000')"

                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();
                var sPath = oDataModel.createKey("/Products", {
                    Productno : oBody.Productno
                });

                oDataModel.remove(sPath, {
                    success: function(){
                        sap.m.MessageToast.show("삭제 완료");
                    }
                });
                
            }
        });
    });
