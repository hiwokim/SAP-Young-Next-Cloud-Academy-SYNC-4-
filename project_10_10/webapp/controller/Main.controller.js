sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, FlattenedDataset, FeedItem) {
        "use strict";

        return Controller.extend("project1010.controller.Main", {
            onInit: function () {
                var oData = {
                    list : [
                        { name : 'aaa', rate : '35', cost : '10'},
                        { name : 'bbb', rate : '15', cost : '12'},
                        { name : 'ccc', rate : '10', cost : '11'},
                        { name : 'ddd', rate : '15', cost : '15'},
                        { name : 'eee', rate : '20', cost : '10'},
                        { name : 'fff', rate : '5', cost : '16'}
                    ]
                }

                this.getView().setModel(new JSONModel(oData), "view");

                var oPopover = this.byId("idPopover");
                oPopover.connect(this.byId("idLineChart").getVizUid());
                
                this._setChartInController();
            },

            _setChartInController: function(){
                var oData = {
                    sales : [
                        { product : "Jackets", amount : "65" },
                        { product : "Shirt", amount : "70" },
                        { product : "Pants", amount : "83" },
                        { product : "Coats", amount : "92" },
                        { product : "Purse", amount : "77" }
                    ]
                }
                this.getView().setModel(new JSONModel(oData), 'cont');

                // chart
                var oColFrame = this.byId("idColChart");

                // dataset
                var oColDataset = new FlattenedDataset({
                    dimensions : [
                        { 
                            name : 'Product', // 카테고리명
                            value : '{cont>product}' // 데이터 정보
                        }
                    ],
                    measures : [
                        {
                            name : 'Amount',
                            value : '{cont>amount}'
                        }
                    ],
                    data : {
                        path : 'cont>/sales'
                    }
                });

                oColFrame.setDataset(oColDataset);

                var feedColValueAxis = new FeedItem({
                    uid : 'valueAxis',
                    type : 'Measure',
                    values : ['Amount']
                });

                var feedColCategoryAxis = new FeedItem({
                    uid : 'categoryAxis',
                    type : 'Dimension',
                    values : ['Product']
                });

                oColFrame.addFeed(feedColValueAxis);
                oColFrame.addFeed(feedColCategoryAxis);

                oColFrame.setVizProperties({
                    title : { text : '두번째 차트' }
                });
            }
        });
    });
