sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Image",
    "sap/m/HBox"
], function (Controller, JSONModel, ODataModel, Filter, FilterOperator, MessageToast, Dialog, Image, HBox) {
    "use strict";
    var Mdata;

    return Controller.extend("sync.projectcust.controller.View1", {
        onInit: function () {
            var oDataModel = new ODataModel("/sap/opu/odata/sap/ZGW_ZBC10_SRV/", true);
            var oView = this.getView();

            oDataModel.read("/ZBCT_CUST_MSet", {
                success: function(oData) {
                    // JSON 모델에 데이터 설정
                    var oJSONModel = new JSONModel({ results: oData.results });
                    oView.setModel(oJSONModel);
                    Mdata = oData.results;
                    this.onFilterByMatnr("ALL"); // 필터링 적용
                }.bind(this),
                error: function(oError) {
                    MessageToast.show("데이터 로드 오류");
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

                // PartnerId 기준으로 중복 제거
            Sdata = Array.from(
                new Map(Sdata.map(item => [item.PartnerId, item])).values()
            );

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
                            width: "100px",
                            height: "auto",
                            press: this.onImagePress.bind(this) // 이미지 클릭 이벤트 바인딩
                        }),
                        new sap.m.ObjectIdentifier({ text: "{filteredModel>PartnerId}" }),
                        new sap.m.Text({ text: "{filteredModel>PartnerName}" }),
                        new sap.m.RatingIndicator({ value: "{filteredModel>Rating}", iconSize: "1rem", editable: false, enabled: false }), // 수정 불가능하고 비활성화 설정
                        new sap.m.Text({ text: "{filteredModel>Crnum}" }),
                        new sap.m.Text({ text: "{filteredModel>Telno}" }),
                        new sap.m.Text({ text: "{filteredModel>Address}" }),
                        new sap.m.HBox({
                            justifyContent: "Center", // 아이콘을 가운데 정렬
                            items: [
                                new sap.ui.core.Icon({
                                    src: "sap-icon://SAP-icons-TNT/escalation-end-event",
                                    size: "2rem", // 아이콘 크기 설정
                                    color: "green",
                                    press: this.onLocationCheck.bind(this) // 아이콘 클릭 이벤트 바인딩
                                })
                            ]
                        })
                    ],
                    type: "Inactive" // 행 클릭 비활성화
                })
            });
        },

        onImagePress: function(oEvent) {
            var sImageSrc = oEvent.getSource().getSrc();

            // 이미지 객체 생성
            var oImage = new sap.m.Image({
                src: sImageSrc,
                width: "300px", // 이미지의 가로 크기를 300px로 설정
                height: "auto", // 세로 크기는 자동으로 조정됨
                densityAware: false
            });

            // 중앙 정렬을 위한 VBox 컨테이너 생성
            var oVBox = new sap.m.VBox({
                items: [oImage],
                justifyContent: "Center",
                alignItems: "Center",
                width: "100%",
                height: "100%"
            });

            // 다이얼로그 생성
            var oImageDialog = new sap.m.Dialog({
                title: "이미지 확대 보기",
                contentWidth: "auto",
                contentHeight: "auto",
                horizontalScrolling: false,
                verticalScrolling: false,
                content: oVBox,
                beginButton: new sap.m.Button({
                    text: "닫기",
                    press: function() {
                        oImageDialog.close();
                    }
                })
            });

            // 다이얼로그 열기
            oImageDialog.open();
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
                                        <h1>${oData.PartnerName}</h1>
                                        <p>${oData.Address}</p>
                                      </div>`
                        
                        });

                        
                        
                        // 인포윈도우 열기
                        infowindow.open(map, marker);

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
