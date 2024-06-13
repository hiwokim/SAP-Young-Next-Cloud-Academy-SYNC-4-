sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/unified/library",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/ColumnListItem",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat"
], function(Controller, JSONModel, unifiedLibrary, ODataModel, Dialog, Button, Table, Column, Label, Text, ColumnListItem, MessageToast, DateFormat) {
    "use strict";
    var CalendarDayType = unifiedLibrary.CalendarDayType;
    var oDataModel = new ODataModel("/sap/opu/odata/sap/ZGW_ZBC10_SRV/", true);
    var Mdata = [];
    var Sdata = [];
    var Sdata2;
    var oTable = new Table();
    var MainData;

    return Controller.extend("sync.projectporead.controller.View1", {

        onInit: function() {
            this.set_range();
            this.createDialog();
        },


        // 나머지 코드는 그대로 유지


        setCount: function() {
            var oModel = this.getView().getModel();
            var oData = oModel.getProperty("/appointments"); // Fetch appointments data from the model
            var allCount = oData.length;
        
            var coffeeCount = oData.filter(function(appointment) {
                return appointment.text.includes('생두');
            }).length;
        
            var packagingCount = oData.filter(function(appointment) {
                return appointment.text.includes('포장재');
            }).length;
        
            var oAllTab = this.byId("allTab");
            oAllTab.setCount(allCount.toString());
        
            var oCoffeeTab = this.byId("coffeeTab");
            oCoffeeTab.setCount(coffeeCount.toString());
        
            var oPackagingTab = this.byId("packagingTab");
            oPackagingTab.setCount(packagingCount.toString());
        },

        onTabSelect: function(oEvent) {
            var sKey = oEvent.getParameter("key");

            switch (sKey) {
                case "all":
                    this.onAllButtonClick();
                    break;
                case "coffee":
                    this.onCoffeeButtonClick();
                    break;
                case "packaging":
                    this.onPackagingButtonClick();
                    break;
            }
        },

        onAllButtonClick: function() {
            this.applyFilter("전체");
        },

        onCoffeeButtonClick: function() {
            this.applyFilter("생두");
        },

        onPackagingButtonClick: function() {
            this.applyFilter("포장재");
        },

        applyFilter: function(filter) {
            var oModel = this.getView().getModel();
            var oData = MainData;
            
            var filteredAppointments = oData.appointments.filter(function(appointment) {
                return filter === "전체" || 
                    (filter === "생두" && appointment.text.endsWith("생두")) || 
                    (filter === "포장재" && appointment.text.endsWith("포장재"));
            });

            filteredAppointments.forEach(function(appointment) {
                appointment.startDate = new Date(appointment.startDate);
                appointment.endDate = new Date(appointment.endDate);
            });

            oModel.setProperty("/appointments", filteredAppointments);
            
        },

        moreLinkPress: function(oEvent) {
            
            var oDate = oEvent.getParameter("date");
            var oModel = this.getView().getModel();
            var oAppointments = oModel.getProperty("/appointments");
            oDate.setHours(9, 0, 0, 0);

            Sdata = Mdata.filter(function(item) {
                if (item.OrderDate && item.DueDate) {
                    var orderDate = item.OrderDate;
                    var dueDate = item.DueDate;
                    
                    if (orderDate <= oDate && dueDate >= oDate) {
                        return oAppointments.some(function(appointment) {
                            return appointment.text === item.Product;
                        });
                    }
                }
                return false;
            }).map(function(item, index) {
                item.Index = index + 1;
                return item;
            });
        
            var oTableModel = new JSONModel(Sdata);
            oTable.setModel(oTableModel);
        
            this.oDialog.open();
        },

        createDialog: function() {
            if (!this.oDialog) {
                this.oDialog = new Dialog({
                    title: "주문 정보",
                    content: oTable,
                    endButton: new Button({
                        text: "닫기",
                        press: function() {
                            this.oDialog.close();
                        }.bind(this)
                    }),
                });

                this.getView().addDependent(this.oDialog);
                this.setTable();
            }
        },

        onExecuteFunctionPress: function() {
            MessageToast.show("Function executed from Dialog!");
            console.log("Function executed from Dialog!");

            if (this.oDialog) {
                this.oDialog.close();
            }
        },

        onAppointmentClick: function(oEvent) {
            var oAppointment = oEvent.getParameter("appointment");
            if (oAppointment) {
                var sText = oAppointment.getText();
                if(oAppointment.getText() != null){
                    Sdata2 = Mdata.filter(function(item) {
                        return item.Product === sText && item.InvoiceNum !== "";
                    });
                }

                var oDialog = new Dialog({
                    title: "주문 정보",
                    contentWidth: "auto",
                    contentHeight: "auto",
                    content: new Table({
                        columns: [
                            new Column({ header: new Text({ text: "주문 번호" }), width: "150px", hAlign: "Center" }),
                            new Column({ header: new Text({ text: "송장 번호" }), width: "150px", hAlign: "Center" }),
                            new Column({ header: new Text({ text: "주문일" }), hAlign: "Center" }),
                            new Column({ header: new Text({ text: "납기일" }), hAlign: "Center" }),
                            new Column({ header: new Text({ text: "공급업체명" }), width: "150px", hAlign: "Center" }),
                            new Column({ header: new Text({ text: "국가명" }), hAlign: "Center" }),
                            new Column({ header: new Text({ text: "상품명" }), width: "200px", hAlign: "Center" }),
                            new Column({ header: new Text({ text: "갯수" }), hAlign: "Center" }),
                            new Column({ header: new Text({ text: "원화 총 가격" }), width: "180px", hAlign: "Center" }),
                            new Column({ header: new Text({ text: "단가" }), hAlign: "Center" }),
                        ],
                        items: [
                            new ColumnListItem({
                                cells: [
                                    new Text({ text: Sdata2[0].Pono }),
                                    new Text({ text: Sdata2[0].InvoiceNum }),
                                    new Text({ text: this.formatDate(Sdata2[0].OrderDate) }),
                                    new Text({ text: this.formatDate(Sdata2[0].DueDate) }),
                                    new Text({ text: Sdata2[0].Venam }),
                                    new Text({ text: Sdata2[0].FromNa }),
                                    new Text({ text: Sdata2[0].Product }),
                                    new Text({ text: this.formatNumber(Sdata2[0].Weight) + " " + this.formatUnit(Sdata2[0].WUnit)}),
                                    new Text({ text: this.formatNumber(Sdata2[0].KPrice) + " " + Sdata2[0].Tcurr}), 
                                    new Text({ text: this.formatNumber(Sdata2[0].Uprice ) + " " + Sdata2[0].Cuky }), 
                                ]
                            })
                        ]
                    }),
                    beginButton: new Button({
                        text: "닫기",
                        press: function() {
                            oDialog.close();
                        }
                    })
                });
        
                oDialog.open();
            }
        },

        setTable: function() {
            oTable.removeAllColumns();

            var oColumnNames = [
                { label: "번호", path: "Index", width: "50px" },
                { label: "주문 번호", path: "Pono", width: "150px" },
                { label: "송장 번호", path: "InvoiceNum", width: "150px" },
                { label: "주문일", path: "OrderDate", formatter: this.formatDate },
                { label: "납기일", path: "DueDate", formatter: this.formatDate },
                { label: "공급업체명", path: "Venam", width: "150px" },
                { label: "국가명", path: "FromNa" },
                { label: "상품명", path: "Product", width: "200px" },
                {
                    label: "갯수",
                    parts: ["Weight", "WUnit"],
                    formatter: function(weight, unit) {
                        if (unit === "KGM") {
                            unit = "KG";
                        }
                        weight = parseFloat(weight);
                        if (!isNaN(weight)) {
                            return weight.toLocaleString() + " " + unit;
                        }
                        return "";
                    }
                },
                {
                    label: "원화 총 가격",
                    parts: ["KPrice", "Tcurr"],
                    formatter: function(kprice, tcurr) {
                        kprice = parseFloat(kprice);
                        if (!isNaN(kprice)) {
                            return kprice.toLocaleString() + " " + tcurr;
                        }
                        return "";
                    },
                    width: "180px"
                },
                {
                    label: "단가",
                    parts: [ "Uprice", "Cuky" ],
                    formatter: function(uprice, cuky) {
                        return uprice + " " + cuky;
                    }
                }
            ];
            
            oColumnNames.forEach(function(col) {
                oTable.addColumn(new Column({
                    header: new Label({ text: col.label }),
                    width: col.width,
                    hAlign: "Center"
                }));
            });

            oTable.bindItems({
                path: "/",
                template: new ColumnListItem({
                    cells: oColumnNames.map(function(col) {
                        if (col.parts) {
                            return new Text({
                                text: {
                                    parts: col.parts.map(function(part) {
                                        return { path: part };
                                    }),
                                    formatter: col.formatter
                                }
                            });
                        } else {
                            return new Text({
                                text: {
                                    path: col.path,
                                    formatter: col.formatter
                                }
                            });
                        }
                    })
                }),
            });

            oTable.attachEvent("appointmentPress", this.onAppointmentClick, this);
        },

        set_range: function() {
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth();
            var date = today.getDate();
            var oModel = new JSONModel({
                startDate: new Date(year, month, date),
                appointments: []
            });
            this.getView().setModel(oModel);

            oDataModel.read("/ZBCT_IMP_POSet", {
                success: function(oReturn) {
                    console.log(oReturn);
                    var oData = oModel.getData();
                    Mdata = oReturn.results;

                    Mdata.sort(function(a, b) {
                        return b.Pono.localeCompare(a.Pono);
                    });

                    Mdata.forEach(function(item, index) {
                        item.Index = index + 1;

                        let year_o = new Date(item.OrderDate).getFullYear();
                        let month_o = new Date(item.OrderDate).getMonth();
                        let date_o = new Date(item.OrderDate).getDate();
                        let year_d = new Date(item.DueDate).getFullYear();
                        let month_d = new Date(item.DueDate).getMonth();
                        let date_d = new Date(item.DueDate).getDate();

                        var calendarDayType;
                        var icon;

                        if (item.Pono.startsWith('IPO')) {
                            calendarDayType = CalendarDayType.Type08;
                            icon = "https://pic.onlinewebfonts.com/thumbnails/icons_479732.svg"
                        } else if (item.Pono.startsWith('KPO')) {
                            calendarDayType = CalendarDayType.Type06;
                            icon = "https://cdn-icons-png.flaticon.com/512/4720/4720989.png"
                        } else {
                            calendarDayType = CalendarDayType.Type01;
                        }
                        if ((item.Pono.startsWith('IPO') || item.Pono.startsWith('KPO')) &&
                            item.OrderDate !== "" &&
                            item.DueDate !== "" &&
                            item.InvoiceNum !== "" &&
                            (item.InvoiceNum.startsWith('INV') || item.InvoiceNum.startsWith('CNV')) &&
                            item.Pono !== "") {

                            oData.appointments.push({
                                title: item.Product + "  [ " + year_o + "/" + (month_o + 1) + "/" + date_o +
                                    " ~ " + year_d + "/" + (month_d + 1) + "/" + date_d + " ]",
                                text: item.Product,
                                type: calendarDayType,
                                startDate: new Date(year_o, month_o, date_o),
                                endDate: new Date(year_d, month_d, date_d),
                                icon: icon
                            });
                        }
                    }.bind(this));

                    oModel.setProperty("/appointments", oData.appointments);
                    MainData = JSON.parse(JSON.stringify(oModel.getData()));
                    this.setCount();
                }.bind(this),
                error: function(oError) {
                    MessageToast.show("Error loading data");
                }
            });
        },

        formatDate: function(date) {
            if (date) {
                var oDateFormat = DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
                return oDateFormat.format(new Date(date));
            }
            return date;
        },

        formatUnit: function(unit) {
            if (unit === "KGM") {
                return " KG";
            } else if (unit === "EA") {
                return " EA";
            }
        },

        formatNumber: function(number) {
            if (number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return number;
        },
    });
});
