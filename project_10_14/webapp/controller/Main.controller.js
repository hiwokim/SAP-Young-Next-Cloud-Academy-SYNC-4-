sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
	"sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, MessageToast, Fragment, Filter) {
        "use strict";
        
        return Controller.extend("project1014.controller.Main", {
            onInit: function () {
                var oData = {
                    Memid : "",
                    Memnm : "",
                    Telno : "",
                    Email : ""
                }
                this.getView().setModel(new JSONModel(oData), 'data');
            },

            onRowSelectionChange: function(oEvent) {   
                // Row 선택 해제 되었을 때도, '선택'된 것이기 떄문에 이벤트 발생
                // 따라서 rowContext가 없을 땐 함수 종료하도록 함
                if(!oEvent.getParameter('rowContext')) return; // 질문
                
                var sPath = oEvent.getParameter('rowContext').getPath();                             
                var oSelectData = this.getView().getModel().getProperty(sPath); 

                //data 모델 가져와서
                var oModel = this.getView().getModel("data");                
                //data 모델에 set
                oModel.setData(oSelectData);                
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
                    Memid : "",
                    Memnm : "",
                    Telno : "",
                    Email : ""
                });                
                this.byId("idTable").clearSelection();
                oModel.refresh(true);
               
            },
            // 전체 조회 : GET 요청
            onEntitySet: function(oEvent){
                var oDataModel = this.getView().getModel();
                var oButton = oEvent.getSource(),
				    oView = this.getView();

                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "project1014.view.fragment.Popover",
                        controller: this
                    }).then(function(oPopover) {
                        oPopover.setModel(new JSONModel(), 'popover')
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }
                this._pPopover.then(function(oPopover) {
                    oPopover.openBy(oButton);
                });

                // oDataModel.read("/Member", {
                //     success: function(oReturn){
                //         this._showMessage("N","전체조회 성공 ");
                //         console.log(oReturn);
                //     }.bind(this),
                //     error: function(){
                //         this._showMessage("E","전체조회 중 오류 발생 ");
                //     }.bind(this)
                // });

            },
            // 한 건 조회 : GET 요청
            onEntity: function(){
                var oDataModel = this.getView().getModel();
                var oJSONData = this.getView().getModel('data').getData();
                var sPath = oDataModel.createKey("/Member", {
                    Memid : oJSONData.Memid // Member('00001')
                });

                oDataModel.read(sPath, {
                    success: function(oReturn){
                        this._showMessage("N","한건 조회 성공");
                        console.log(oReturn);
                    }.bind(this),
                    error: function(){
                        this._showMessage("E","한건 조회 중 오류 발생 ");
                    }.bind(this)
                });
            },
            // 데이터 생성 : POST 요청
            onCreate: function(){
                var oDataModel = this.getView().getModel();
                var oJSONData = this.getView().getModel('data').getData();
                var oBody = {
                    Memid : oJSONData.Memid,
                    Memnm : oJSONData.Memnm || "",
                    Telno : oJSONData.Telno || "",
                    Email : oJSONData.Email || ""
                    
                    // WorkSet : [
                    //     {}, {}, {}, ...
                    // ]
                };

                oDataModel.create("/Member", oBody, {
                    success: function(){
                        // 서버 요청 끝난 후 작업은 해당 함수 안에서 구현
                        // 해당 함수 안에서 this가 달라지기 때문에,
                        // 이전에 사용하던 this를 그대로 넘겨주기 위해서
                        // .bind(this)를 적용시킴
                        this._showMessage("N","데이터 생성 완료");
                    }.bind(this),
                    error: function(){
                        this._showMessage("E","에러 발생");
                    }.bind(this)
                });
            },
            // 데이터 생성 : PUT 요청
            onUpdate: function(){
                var oDataModel = this.getView().getModel();
                var oBody = this.getView().getModel('data').getData();
                var sPath = oDataModel.createKey("/Member", {
                    Memid : oBody.Memid
                });

                oDataModel.update(sPath, oBody, {
                    success: function(){
                        this._showMessage("N","데이터 업데이트 완료");
                    }.bind(this),
                    error: function(){
                        this._showMessage("E","데이터 업데이트 실패");
                    }.bind(this)
                });
            },
            // 데이터 삭제 : DELETE 요청
            onDelete: function(){

                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();
                var sPath = oDataModel.createKey("/Member", {
                    Memid : oBody.Memid
                });

                oDataModel.remove(sPath, {
                    success: function(){
                        this._showMessage("S","삭제 완료");
                    }.bind(this)
                });
                
            },

            _showMessage: function(ch, msg) {
                switch(ch){
                    case 'N':
                        sap.m.MessageToast.show(msg);
                        break;
                    case 'S':
                        sap.m.MessageBox.success(msg);
                        break;
                    case 'E':
                        sap.m.MessageBox.error(msg);
                        break;
                }
            },
            onRead: function(){
                // var oPopover = sap.ui.getCore().byId("myPopover");

                // Fragment.load() 사용
                // view id를 같이 넘겨줬기 때문에 view 안에 popover가 붙게됨
                // 따라서 this.byId() 로 접근 가능
                var oPopover = this.byId("myPopover");
                var oPopoverModel = oPopover.getModel('popover');
                var oData = oPopoverModel.getData();
                var oDataModel = this.getView().getModel();

                var oFilter = new Filter("Memnm","Contatins",oData);
                oDataModel.read("/Member", {
                    urlParameters: {
                        "$expand" : "WorkSet",
                        "$select" : "Memid,WorkSet" //workset만 조회가능
                    },
                    filters: [oFilter],
                    success: function(oReturn){
                        debugger;
                        console.log(`검색어(${oData.Membername}) : `, oReturn.results);
                    },
                    error: function(oError){
                        console.log("전체조회 중 오류 발생 ", oError);
                    }
                });
            }
            
        });
    });
