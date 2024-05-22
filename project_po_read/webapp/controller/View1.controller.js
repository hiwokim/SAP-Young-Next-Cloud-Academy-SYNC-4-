sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/unified/library",
    "sap/ui/core/date/UI5Date",
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
], function(Controller, JSONModel, unifiedLibrary, UI5Date, ODataModel, Dialog, Button, Table, Column, Label, Text, ColumnListItem, MessageToast, DateFormat) {
    "use strict";
    var CalendarDayType = unifiedLibrary.CalendarDayType;
    var oDataModel = new ODataModel("/sap/opu/odata/sap/ZGW_ZBC10_SRV/", true);
    // var oDataModel = this.getOwnerComponent().getModel();
    var Mdata = [];
    var Sdata = [];
	var Sdata2;
    var oTable = new Table();

    return Controller.extend("sync.projectporead.controller.View1", {

        onInit: function() {
            this.set_range();
            this.createDialog();
        },

        moreLinkPress: function(oEvent) {
            var oDate = oEvent.getParameter("date");
            oDate.setHours(9, 0, 0, 0);
            Sdata = Mdata.filter(function(item) {
                return item.OrderDate <= oDate && item.DueDate >= oDate;
            }).map(function(item, index) {
                item.Index = index + 1; // 인덱스를 추가
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
                        text: "Cancel",
                        press: function() {
                            this.oDialog.close();
                        }.bind(this)
                    })
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
				var sTitle = oAppointment.getTitle();
				Sdata2 = Mdata.filter(function(item) {
					return item.Product === sTitle;
				});

				// 다이얼로그 생성
				var oDialog = new Dialog({
					title: "주문 정보",
					contentWidth: "auto",
					contentHeight: "auto",
					content: new Table({
						columns: [
							new Column({ header: new Text({ text: "주문 번호" }) }),
							new Column({ header: new Text({ text: "송장 번호" }) }),
							new Column({ header: new Text({ text: "주문일" }) }),
							new Column({ header: new Text({ text: "납기일" }) }),
							new Column({ header: new Text({ text: "공급업체명" }) }),
							new Column({ header: new Text({ text: "국가명" }) }),
							new Column({ header: new Text({ text: "상품명" }) }),
							new Column({ header: new Text({ text: "갯수" }) }),
							new Column({ header: new Text({ text: "단위" }) }),
							new Column({ header: new Text({ text: "원화 총 가격" }) }),
							new Column({ header: new Text({ text: "원화 통화" }) }),
							new Column({ header: new Text({ text: "단가" }) }),
							new Column({ header: new Text({ text: "단가 통화" }) })
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
									new Text({ text: this.formatNumber(Sdata2[0].Weight) }),
									new Text({ text: this.formatUnit(Sdata2[0].WUnit) }),
									new Text({ text: this.formatNumber(Sdata2[0].KPrice) }),
									new Text({ text: Sdata2[0].Tcurr }),
									new Text({ text: this.formatNumber(Sdata2[0].Uprice ) }),
									new Text({ text: this.formatUnit(Sdata2[0].Cuky ) })
								]
							})
						]
					}),
					beginButton: new Button({
						text: "Close",
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
                { label: "Index", path: "Index" }, // 인덱스 열 추가
                { label: "주문 번호", path: "Pono" },
                { label: "송장 번호", path: "InvoiceNum" },
                { label: "주문일", path: "OrderDate", formatter: this.formatDate },
                { label: "납기일", path: "DueDate", formatter: this.formatDate },
                { label: "공급업체명", path: "Venam" },
                { label: "국가명", path: "FromNa" },
                { label: "상품명", path: "Product" },
                { label: "갯수", path: "Weight", formatter: this.formatNumber  },
                { label: "단위", path: "WUnit", formatter: this.formatUnit },
                { label: "원화 총 가격", path: "KPrice", formatter: this.formatNumber }, // 콤마 포맷터 추가
                { label: "원화 통화", path: "Tcurr" },
                { label: "단가", path: "Uprice" },
                { label: "단가 통화", path: "Cuky" }
            ];

            oColumnNames.forEach(function(col) {
                oTable.addColumn(new Column({
                    header: new Label({ text: col.label })
                }));
            });

            oTable.bindItems({
                path: "/",
                template: new ColumnListItem({
                    cells: oColumnNames.map(function(col) {
                        return new Text({ 
                            text: {
                                path: col.path,
                                formatter: col.formatter // 포맷터 추가
                            }
                        });
                    })
                }),
            });

            // Appointments 클릭 이벤트 바인딩
            oTable.attachEvent("appointmentPress", this.onAppointmentClick, this);
        },

        set_range: function() {
            var today = new Date();   
            var year = today.getFullYear();
            var month = today.getMonth();
            var date = today.getDate();
            var oModel_cal = new JSONModel({
                startDate: UI5Date.getInstance(year, month, date),
                appointments: []
            });
            this.getView().setModel(oModel_cal);

            oDataModel.read("/ZBCT_IMP_POSet", {
                success: function(oReturn) {
                    console.log(oReturn);
                    var oData = oModel_cal.getData();
                    Mdata = oReturn.results;

                    // 주문 번호(Pono)로 정렬
                    Mdata.sort(function(a, b) {
						return b.Pono.localeCompare(a.Pono);
					});

                    // 인덱스 값 추가 및 랜덤한 type 설정
                    Mdata.forEach(function(item, index) {
                        item.Index = index + 1;
                        let year_o = item.OrderDate.getFullYear();
                        let month_o = item.OrderDate.getMonth();
                        let date_o = item.OrderDate.getDate();
                        let year_d = item.DueDate.getFullYear();
                        let month_d = item.DueDate.getMonth();
                        let date_d = item.DueDate.getDate();
						let randomType = Math.floor(Math.random() * 7); // 0부터 6까지의 랜덤 정수
						let calendarDayType;
						switch (randomType) {
							case 0:
								calendarDayType = CalendarDayType.Type01;
								break;
							case 1:
								calendarDayType = CalendarDayType.Type02;
								break;
							case 2:
								calendarDayType = CalendarDayType.Type03;
								break;
							case 3:
								calendarDayType = CalendarDayType.Type04;
								break;
							case 4:
								calendarDayType = CalendarDayType.Type05;
								break;
							case 5:
								calendarDayType = CalendarDayType.Type06;
								break;
							case 6:
								calendarDayType = CalendarDayType.Type07;
								break;
							default:
								calendarDayType = CalendarDayType.Type01;
								break;
						}

						oData.appointments.push({
							title: item.Product,
							type: calendarDayType,
							startDate: UI5Date.getInstance(year_o, month_o, date_o),
							endDate: UI5Date.getInstance(year_d, month_d, date_d)
						});
                    });
                    oModel_cal.setProperty("/oData", oData);
                },
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
                return "KG";
            }
            return unit;
        },

        formatNumber: function(number) {
            if (number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return number;
        }

    });
});
