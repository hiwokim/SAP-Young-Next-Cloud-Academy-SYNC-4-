sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter', 
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, JSONModel) {
        "use strict";

        return Controller.extend("exam.exprogram10.controller.Main", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteMain").attachPatternMatched(this._onPatternMatched, this);
                var oData = {
                    CategoryID : '',
                    CategoryName : ''
                }
                this.getView().setModel(new JSONModel(oData), 'search');
                
            },
            _onPatternMatched:function(){
                this.byId("input1").setValue(null);
                this.byId("input2").setValue(null);
                this.byId("idTable").removeSelections();
                var oChart = this.byId("idChart");
                var aFilter = [];  
                aFilter.push(new Filter({ 
                        path : 'nodata',
                        operator : 'EQ',
                        value1 : 0,
                        value2 : ''
                }));
                this.byId("idTable2").getBinding().filter(aFilter);
                oChart.getDataset().getBinding("data").filter(aFilter);
            },
            onSearch: function(){
                var oSearchData = this.getView().getModel('search').getData();
                var aFilter = [];

                if(oSearchData.CategoryID){
                    aFilter.push(new Filter({ 
                        path : 'CategoryID', 
                        operator : 'GE', 
                        value1 : oSearchData.CategoryID, 
                        value2 : ''
                        
                    }));
                }
                if(oSearchData.CategoryName){
                    aFilter.push(new Filter({ 
                        path : 'CategoryName',
                        operator : 'Contains',
                        value1 : oSearchData.CategoryName,
                        value2 : ''
                    }));
                }
                
                this.byId("idTable").getBinding("items").filter(aFilter);
            },
            onSelectionChange: function(oEvent) {
                var sPath = oEvent.getParameters().listItem.getBindingContextPath();
                var oSelectData = this.getView().getModel().getProperty(sPath);
                var oChart = this.byId("idChart");
                var aFilter = [];  
                if(oSelectData.CategoryID){
                    aFilter.push(new Filter({ 
                        path : 'CategoryID',
                        operator : 'EQ',
                        value1 : oSelectData.CategoryID,
                        value2 : ''
                    }));
                }
                this.byId("idTable2").getBinding().filter(aFilter);
                oChart.getDataset().getBinding("data").filter(aFilter);
            },
            OselectData: function(oEvent){
                var ProductNamedata = oEvent.getParameters().data[0].data.ProductName;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo('RouteDetail', {
                    ProductName : ProductNamedata
                });
            }
        });
    });
