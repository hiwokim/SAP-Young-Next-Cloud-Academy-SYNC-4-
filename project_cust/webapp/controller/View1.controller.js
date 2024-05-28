sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, ODataModel, Filter, FilterOperator, MessageToast) {
    "use strict";
    var Mdata;

    return Controller.extend("sync.projectcust.controller.View1", {
        onInit: function () {
            var oDataModel = new ODataModel("/sap/opu/odata/sap/ZGW_ZBC10_SRV/", true);
            var oView = this.getView();

            oDataModel.read("/ZBCT_CUST_MSet", {
                success: function(oData) {
                    // 각 데이터 항목에 Rating 기본값 추가

                    // JSON 모델에 데이터 설정
                    var oJSONModel = new JSONModel({ results: oData.results });
                    oView.setModel(oJSONModel);
                    Mdata = oData.results;
                    this.onFilterByMatnr("ALL"); // 그 후 필터링 적용
                }.bind(this),
                error: function(oError) {
                    MessageToast.show("Error loading data");
                }
            });
            
        },

        onImportVendorFilter: function() {
            this.onFilterByMatnr("RM");
        },

        onDomesticVendorFilter: function() {
            this.onFilterByMatnr("PM");
        },

        onCustomerFilter: function() {
            this.onFilterByMatnr("FG");
        },

        onAllFilter: function() {
            this.onFilterByMatnr("ALL");
        },

        onFilterByMatnr: function(matnr) {
            var Sdata;
            if (matnr === "ALL") {
                Sdata = Mdata;
            } else {
                Sdata = Mdata.filter(function(item) {
                    return item.Matnr.startsWith(matnr);
                });
            }

            // 필터링된 데이터를 JSON 모델에 설정
            var oFilteredModel = new JSONModel({ results: Sdata });
            this.getView().setModel(oFilteredModel, "filteredModel");

            // 테이블에 필터링된 데이터 바인딩
            var oTable = this.getView().byId("customerTable");
            oTable.setModel(oFilteredModel, "filteredModel");
            oTable.bindItems({
                path: "filteredModel>/results",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Image({
                            src: {
                                path: "filteredModel>PartnerId",
                                formatter: function (partnerId) {
                                    var imageUrl = "../img/" + partnerId + ".jpg";
                                    return imageUrl;
                                }
                            },
                            width: "75px",
                            height: "75px"
                        }),
                        new sap.m.ObjectIdentifier({ text: "{filteredModel>PartnerId}" }),
                        new sap.m.Text({ text: "{filteredModel>PartnerName}" }),
                        new sap.m.RatingIndicator({ value: "{filteredModel>Rating}", iconSize: "1rem" }),
                        new sap.m.Text({ text: "{filteredModel>Crnum}" }),
                        new sap.m.Text({ text: "{filteredModel>Telno}" }),
                        new sap.m.Text({ text: "{filteredModel>Address}" }),
                        new sap.m.Button({ text: "위치 확인", press: this.onLocationCheck.bind(this) }) // 버튼 추가
                        // new sap.m.Text({ text: "{filteredModel>Matnr}" }),
                        // new sap.m.Text({ text: "{filteredModel>Manam}" })
                    ]
                })
            });
        },
        onLocationCheck: function(event) {
            // 이벤트에서 바인딩된 데이터 가져오기
            var oContext = event.getSource().getBindingContext("filteredModel");
            var oData = oContext.getObject();
            var lat = parseFloat(oData.Lat); // lat 값
            var lng = parseFloat(oData.Lng); // lng 값
        
            // 다이얼로그 생성
            var oDialog = new sap.m.Dialog({
                title: "고객사 위치",
                contentWidth: "80%",
                contentHeight: "80%",
                beginButton: new sap.m.Button({
                    text: "닫기",
                    press: function() {
                        oDialog.close();
                    }
                }),
                afterOpen: function() {
                    // 구글 맵 API 로드
                    if (!window.google || !window.google.maps) {
                        var script = document.createElement("script");
                        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAdsxuHatuArOEckv2CH9LvyJh_bKH_b50";
                        script.async = true;
                        script.defer = true;
                        script.onload = function () {
                            initializeMap();
                        };
                        document.body.appendChild(script);
                    } else {
                        initializeMap();
                    }
                    
                    function initializeMap() {
                        var mapOptions = {
                            center: { lat: lat, lng: lng }, // 선택된 고객사의 좌표로 설정
                            zoom: 15
                        };
                        
                        // 다이얼로그에 지도를 추가하기 위한 div 요소 생성
                        var mapDiv = document.createElement("div");
                        mapDiv.setAttribute("id", "mapDialog");
                        mapDiv.style.width = "100%";
                        mapDiv.style.height = "100%";
                        
                        // 구글 맵을 그려줄 요소를 가져와서 추가
                        var contentDomRef = oDialog.getDomRef("cont");
                        contentDomRef.appendChild(mapDiv);
                        
                        // 지도 생성
                        var map = new google.maps.Map(mapDiv, mapOptions);
                        var marker = new google.maps.Marker({
                            position: { lat: lat, lng: lng },
                            map: map
                        });
                        
                        // 인포윈도우 생성
                        var infowindow = new google.maps.InfoWindow({
                            content: `<div>
                                        <h3>${oData.PartnerName}</h3>
                                        <p>${oData.Address}</p>
                                      </div>`
                        });
                        
                        // 마커 클릭 시 인포윈도우 열기
                        marker.addListener('click', function() {
                            infowindow.open(map, marker);
                        });
                    }
                }
            });
            
            // 다이얼로그 열기
            oDialog.open();
        }
        
        
        
    });
});
