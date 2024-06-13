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
    var Sdata;
    var filteredData; // 필터링된 데이터
    var check = 0;
    var vender = [
        { code: "CUS0000000001", address: "https://cdnweb01.wikitree.co.kr/webdata/editor/202206/23/img_20220623212558_f01214d4.webp" },
        { code: "CUS0000000002", address: "https://img.79plus.co.kr/megahp/common/img/bi_logo1.png" },
        { code: "CUS0000000003", address: "https://www.denews.co.kr/news/photo/202007/14240_15730_2341.png" },
        { code: "CUS0000000004", address: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FycQDN%2FbtrLYkSsKlx%2FhwoNK8UTIB0Deoku8Spo51%2Fimg.png" },
        { code: "CUS0000000005", address: "https://i.namu.wiki/i/G4gfkTAviaRlio-_S94LCA8UwElL79Uw6I3veA7trpc7t2SUvryDeGluuFNgSld8ko-ecrvonWfN7U-1ao25MP2U5tpEFyvXxaok0oWb-uQuTlE_TZWjCjk6D-xI2FqoLF2NkxgDIENH1KEkO1bJFA.svg" },
        { code: "VENBR001", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000001581/image/detail/1000001581_detail_023.jpg" },
        { code: "VENBR002", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000001196/image/detail/1000001196_detail_017.jpg" },
        { code: "VENCO001", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000000395/image/detail/1000000395_detail_057.jpg" },
        { code: "VENCO002", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000000306/image/detail/1000000306_detail_037.jpg" },
        { code: "VENCR001", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000000625/image/detail/1000000625_detail_032.jpg" },
        { code: "VENCR002", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000000234/image/detail/1000000234_detail_047.jpg" },
        { code: "VENET001", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000000611/image/detail/1000000611_detail_05.jpg" },
        { code: "VENET002", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000000574/image/detail/1000000574_detail_073.jpg" },
        { code: "VENKE001", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000000582/image/detail/1000000582_detail_08.jpg" },
        { code: "VENKE002", address: "https://godomall.speedycdn.net/db0fd08ec1580819a26ad375da930b0d/goods/1000000992/image/detail/1000000992_detail_053.jpg" },
        { code: "VENPM001", address: "https://cdn-pro-web-212-188.cdn-nhncommerce.com/paipack1_godomall_com/data/goods/20/03/11/1000000117/1000000117_add2_091.png" },
    ];
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
        onSearch: function(oEvent) {
            var sQuery = oEvent.getParameter("query");
            this._filterTable(sQuery);
        },

        onLiveChange: function(oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            this._filterTable(sQuery);
        },

        _filterTable: function(sQuery) {
            var oTable = this.byId("customerTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];
        
            if (sQuery && sQuery.length > 0) {
                var oCustomerIdFilter = new Filter("PartnerId", FilterOperator.Contains, sQuery);
                aFilters.push(oCustomerIdFilter);
            }
        
            oBinding.filter(aFilters);
        },
        
        setCount: function() {
            var oData = filteredData; // Mdata를 oData에 대입합니다.
            var allCount = oData.length;
            var coffeeCount = oData.filter(function(item) {
                return item.Matnr.startsWith('RM');
            }).length;

            var packagingCount = oData.filter(function(item) {
                return item.Matnr.startsWith('PM');
            }).length;

            var venderCount = oData.filter(function(item) {
                return item.Matnr.startsWith('FG');
            }).length;
        
            var oAllTab = this.byId("allTab");
            oAllTab.setCount(allCount.toString());
        
            var oCoffeeTab = this.byId("coffeeTab");
            oCoffeeTab.setCount(coffeeCount.toString());
        
            var oPackagingTab = this.byId("packagingTab");
            oPackagingTab.setCount(packagingCount.toString());

            var oVenderTab = this.byId("venderTab");
            oVenderTab.setCount(venderCount.toString());
        },
        onTabSelect: function(oEvent) {
            var sKey = oEvent.getParameter("key");

            var oSearchField = this.byId("searchField"); // SearchField의 ID가 "searchField"라고 가정
            oSearchField.setValue("");

            switch (sKey) {
                case "all":
                    this.onAllFilter();
                    break;
                case "coffee":
                    this.onImportVendorFilter();
                    break;
                case "packaging":
                    this.onDomesticVendorFilter();
                    break;
                case "vender":
                    this.onCustomerFilter();
                    break;
            }
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
            if(check === 0){
                filteredData = Sdata;
                check = 1;
            }
            this.setCount(); // 데이터 로드 후 setCount 호출

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
                                    var imageUrl;
                                    for (var i = 0; i < vender.length; i++) {
                                        if (vender[i].code === partnerId) {
                                            imageUrl = vender[i].address;
                                        }
                                    }
                                    
                                    return imageUrl;
                                }
                            
                            },
                            width: "100px",
                            height: "auto",
                            press: this.onImagePress.bind(this) // 이미지 클릭 이벤트 바인딩
                        }),
                        new sap.m.ObjectIdentifier({ text: "{filteredModel>PartnerId}" }),
                        new sap.m.Text({ text: "{filteredModel>PartnerName}" }),
                        new sap.m.RatingIndicator({
                            value: {
                                path: "filteredModel>Rating",
                                formatter: function(sValue) {
                                    // sValue가 문자열이면 부동 소수점으로 변환하여 반환
                                    return parseFloat(sValue);
                                }
                            },
                            iconSize: "1rem",
                            editable: false,
                            enabled: false
                        }),
                        new sap.m.Text({ text: "{filteredModel>Crnum}" }),
                        new sap.m.Text({ text: "{filteredModel>Telno}" }),
                        new sap.m.Text({ text: "{filteredModel>Address}" }),
                        new sap.m.HBox({
                            justifyContent: "Center", // 아이콘을 가운데 정렬
                            items: [
                                new sap.ui.core.Icon({
                                    src: "sap-icon://map-3",
                                    size: "1.5rem", // 아이콘 크기 설정
                                    color: "#0054FF",
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
