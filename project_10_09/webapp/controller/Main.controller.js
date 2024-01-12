sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter', 
    'sap/ui/model/FilterOperator',
    'sap/ui/model/json/JSONModel',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("odata.project1009.controller.Main", {
            onInit: function () {
                var oData = {
                    OrderID : '',
                    CustomerID : '',
                    OrderDate_start : null,
                    OrderDate_end : null
                }
                this.getView().setModel(new JSONModel(oData), 'search');
            },
            fnDateToString: function (sValue){
                if(sValue){
                    var result;
                    var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern : 'yyyy-MM-dd'
                    });
                    result = oFormat.format(sValue);
                    return result;
                }
            },
            onValueHelpRequest: function (){
                this.getView().byId("idDialog").open();
            },
            onClose: function(oEvent) {
                oEvent.getSource().getParent().close();
            },
            onSearch: function(){
                // var sOrderID = this.byId("idOrderID").getValue();
                // var sCustomerID = this.byId("idCustomerID").getValue();
                // var oStartDate = this.byId("idOrderDateID").getDateValue();
                // var oEndDate = this.byId("idOrderDateID").getSecondDateValue();
                var oSearchData = this.getView().getModel('search').getData();
                var aFilter = [];

                if(oSearchData.OrderDate_start && oSearchData.OrderDate_end){
                    aFilter.push(new Filter({ 
                        path : 'OrderDate', // 대상 필드명
                        operator : 'BT', // 연산자(조건)
                        value1 : oSearchData.OrderDate_start, // 값 (BT의 경우 From)
                        value2 : oSearchData.OrderDate_end // (BT의 경우 To)
                        
                    }));
                }

                if(oSearchData.OrderID){
                    aFilter.push(new Filter({ 
                        path : 'OrderID', // 대상 필드명
                        operator : 'EQ', // 연산자(조건)
                        value1 : oSearchData.OrderID, // 값 (BT의 경우 From)
                        value2 : '' // (BT의 경우 To)
                    }));
                }

                if(oSearchData.CustomerID){
                    aFilter.push(new Filter({ 
                        path : 'CustomerID', // 대상 필드명
                        operator : 'Contains', // 연산자(조건)
                        value1 : oSearchData.CustomerID, // 값 (BT의 경우 From)
                        value2 : '' // (BT의 경우 To)
                    }));
                }   
                this.byId("idTable").getBinding("items").filter(aFilter);

                // ******************** filters 사용 시 *******************
                // var sOrderID = this.byId("idOrderID").getValue();
                // var sCustomerID = this.byId("idCustomerID").getValue();
                // var sOrderDateID = this.byId("idOrderDateID");
                // var aFilter = [];
                // if(sOrderID) aFilter.push(new Filter('OrderID', 'EQ', sOrderID));
                // if(sCustomerID) aFilter.push(new Filter('CustomerID', 'Contains', sCustomerID))
                // if(sOrderDateID) aFilter.push(new Filter('OrderDate', 'BT', sOrderDateID.getDateValue(), sOrderDateID.getSecondDateValue()))
                // this.byId("idTable").getBinding("items").filter(new Filter({
                //      filters : aFilter,
                //      and : true
                // }));
                // filters 쓸 때 주의
                // aFilter 배열에 필터 객체가 1개 이상인 경우만 적용하고, 
                // 필터 객체가 없는 빈 배열이면 적용하지 않기!
                // 
                // var oFilter = new Filter({
                //     filters : [
                //         new Filter('OrderID', 'EQ', sOrderID),
                //         new Filter('CustomerID', 'Contains', sCustomerID)
                //     ],
                //     and : false //OR 조건, 반대는 AND
                // });

                // this.byId("idTable").getBinding("items").filter(oFilter);
            },
            // sap.m.Table 에서, selectionChange 이벤트 실행
            onSelectionChange: function(oEvent) {
                // 상대 경로로 지정되어 있는 데이터 셋에서, 내가 선택한 Row의 모델 경로를 얻음
                var sPath = oEvent.getParameters().listItem.getBindingContextPath();
                // 모델 경로를 통해서, 해당 경로의 전체 데이터를 얻음
                var oSelectData = this.getView().getModel().getProperty(sPath);
                //alert(oSelectData.OrderID);
                // Dialog 호출
                // local 이라는 JSONModel이 전역으로 사용할 수 있도록 생성되어 있음
                // local 모델에 데이터를 담아놓으면
                // Dialog 에서도 사용이 가능함!
                // 주의) Fragment.load() 를 통해서, 팝업 호출 시 
                //      해당 팝업에 모델 데이터를 띄우기 위해서는
                //      호출된 Dialog에 .setModel(모델객체) 해줘야 함
                // this.getView().byId("idDialog");
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo('RouteDetail', {
                    OrderID : oSelectData.OrderID
                });
                // .navTo('라우트객체이름', {파라미터정보}, 라우터 히스토리 초기화)
                // Detail.view.xml 로 이동
                
            }
        });
    });
