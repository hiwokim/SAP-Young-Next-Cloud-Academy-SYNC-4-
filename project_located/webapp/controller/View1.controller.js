sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel) {
        "use strict";
        // markers 배열 정의
        var markers = [];
        var oDataModel = new ODataModel("/sap/opu/odata/sap/ZGW_ZBC10_SRV/", true);
        var ship_locations;
        var locations = [
            { lat: -23.965874, lng: -46.301471, name: "브라질", code: "BRSSZ" },
            { lat: 3.894659, lng: -77.067904, name: "콜롬비아", code: "COBUN" },
            { lat: 9.936058, lng: -84.724969, name: "코스타리카", code: "CRCAL" },
            { lat: 11.606070, lng: 43.140090, name: "에티오피아", code: "DJJIB" },
            { lat: -4.059654, lng: 39.619385, name: "케냐", code: "KEMBA" },
            { lat: 37.459458, lng: 126.625646, name: "인천항", code: "KRINC" },
            { lat: 35.103527, lng: 129.042356, name: "부산항", code: "KRPUS" }
        ];
        var sea_route = [
            {  name: "브라질", code: "BRSSZ", 
                route : 
                [ 
                    { lat: 35.103527, lng: 129.042356 },
                    { lat: 28.208657, lng: 128.524951 },
                    { lat: 13.134138, lng: 143.202687 },
                    { lat: 4.457137, lng: 171.503467 },
                    { lat: -4.191843, lng: -161.733838 },
                    { lat: -19.948126, lng: -123.206456 },
                    { lat: -40.560201, lng: -96.136144 },
                    { lat: -58.662984, lng: -69.768957 },
                    { lat: -42.856296, lng: -51.92716 },
                    { lat: -23.965874, lng: -46.301471 } 
                 ] 
            },
            {  name: "콜롬비아", code: "COBUN", 
                route : 
                [ 
                    { lat: 35.103527, lng: 129.042356 },
                    { lat: 28.208657, lng: 128.524951 },
                    { lat: 24.668068, lng: 141.972216 },
                    { lat: 20.859924, lng: 161.835497 },
                    { lat: 17.540432, lng: -179.4438 },
                    { lat: 13.476264, lng: -155.185988 },
                    { lat: 10.640184, lng: -132.685988 },
                    { lat: 7.777488, lng: -113.437942 },
                    { lat: 1.121724, lng: -98.408645 },
                    { lat: 3.894659, lng: -77.067904 } 
                 ] 
            },
            {  name: "코스타리카", code: "CRCAL", 
                route : 
                [ 
                    { lat: 35.103527, lng: 129.042356 },
                    { lat: 28.208657, lng: 128.524951 },
                    { lat: 24.668068, lng: 141.972216 },
                    { lat: 20.859924, lng: 161.835497 },
                    { lat: 17.540432, lng: -179.4438 },
                    { lat: 13.476264, lng: -155.185988 },
                    { lat: 10.640184, lng: -132.685988 },
                    { lat: 7.777488, lng: -113.437942 },
                    { lat: 6.993041, lng: -97.090286 },
                    { lat: 9.9131, lng: -84.7183 } 
                 ] 
            },
            {  name: "에티오피아", code: "DJJIB", 
                route : 
                [ 
                    { lat: 11.60607, lng: 43.14009 },
                    { lat: 14.746370, lng: 59.862773 },
                    { lat: -2.5907, lng: 67.660692 },
                    { lat: 0.220917, lng: 83.832567 },
                    { lat: 9.016478, lng: 94.071824 },
                    { lat: -0.438258, lng: 105.849168 },
                    { lat: 9.861801, lng: 112.792527 },
                    { lat: 21.760605, lng: 122.196824 },
                    { lat: 31.485908, lng: 125.448777 },
                    { lat: 37.459458, lng: 126.625646 } 
                 ] 
            },
            {  name: "케냐", code: "KEMBA", 
                route : 
                [ 
                    { lat: -4.059654, lng: 39.619385 },
                    { lat: -0.482202, lng: 55.356005 },
                    { lat: -2.5907, lng: 67.660692 },
                    { lat: 0.220917, lng: 83.832567 },
                    { lat: 9.016478, lng: 94.071824 },
                    { lat: -0.438258, lng: 105.849168 },
                    { lat: 9.861801, lng: 112.792527 },
                    { lat: 21.760605, lng: 122.196824 },
                    { lat: 31.485908, lng: 125.448777 },
                    { lat: 37.459458, lng: 126.625646 } 
                 ] 
            }                
        ];
        return Controller.extend("projectlocated.controller.View1", {
            onInit: function () {
                this._initializeGoogleMaps();
            },
            
            _initializeGoogleMaps: function() {
                if (!window.google || !window.google.maps) {
                    window.initMap = this._loadMap.bind(this); // 콜백 함수 설정
                    var script = document.createElement("script");
                    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAdsxuHatuArOEckv2CH9LvyJh_bKH_b50&libraries=marker&callback=initMap";
                    script.async = true;
                    script.defer = true;
                    document.body.appendChild(script);
                } else {
                    this._loadMap();
                }

            },
            
            _loadMap: function() {
   
                var oView = this.getView();
                var mapContainer = oView.byId("mapContainer");

                var mapDiv = document.createElement("div");
                mapDiv.style.width = "100%";
                mapDiv.style.height = window.innerHeight + "px";
                mapContainer.getDomRef().appendChild(mapDiv);
    
                var mapOptions = {
                    center: { lat: 8.391001, lng: 179.781130 }, // 첫 번째 위치를 중심으로 설정
                    zoom: 2.5,
                    minZoom: 2.5,
                    mapId: "YOUR_MAP_ID" // 유효한 지도 ID 추가
                };
    
                var map = new google.maps.Map(mapDiv, mapOptions);

                oDataModel.read("/ZBCT_IMPSet", {
                    success: function(oReturn) {
                        ship_locations = oReturn.results; // oReturn의 결과를 ship_locations에 저장
    
                        // ship_locations의 데이터를 기반으로 마커 추가
                        console.log(ship_locations);
                        ship_locations.forEach(function(location) {
                            const marker = new google.maps.marker.AdvancedMarkerElement({
                                position: new google.maps.LatLng(location.Lat, location.Lng),
                                map: map,
                                title: location.Vessel,
                                content: document.createElement('div')
                            });
                            
                            const iconUrl = "../img/ship.jpg";
                            // const iconUrl = "../img/ship.jpg";
                            const iconElement = marker.content;
                            iconElement.style.backgroundImage = `url(${iconUrl})`;
                            iconElement.style.width = '40px';
                            iconElement.style.height = '40px';
                            iconElement.style.backgroundSize = 'contain';
                            iconElement.style.backgroundRepeat = 'no-repeat';
                            iconElement.style.backgroundPosition = 'center';

                            function formatDate(dateStr) {
                                if (!dateStr) return '';
                                const date = new Date(dateStr);
                                const year = date.getFullYear();
                                const month = ('0' + (date.getMonth() + 1)).slice(-2);
                                const day = ('0' + date.getDate()).slice(-2);
                                return `${year}-${month}-${day}`;
                            }
                        
                            // 변환된 날짜
                            const formattedAtd = formatDate(location.Atd);
                            const formattedGdatu = formatDate(location.Gdatu);
                            const formattedEta = formatDate(location.Eta);
                            
                            // markers 배열에 마커 추가
                            markers.push(marker);

                            // 클릭 이벤트 추가
                            marker.addListener('click', function() {
                                // 클릭된 마커를 제외한 다른 모든 마커의 인포윈도우 닫기
                                closeOtherInfoWindows(marker);
                                
                                // 해당 좌표로 지도 이동
                                map.panTo(marker.position);
                                
                                // 인포윈도우 표시
                                var infowindow = new google.maps.InfoWindow({
                                    content: `<div>
                                                <strong>${location.Vessel}</strong><br>
                                                <b>B/L번호 : </b>${location.BlNum}<br>
                                                <b>수출항 : </b>${location.Eptnr}<br>
                                                <b>수입항 : </b>${location.Podnr}<br>
                                                <b>출항일 : </b>${formattedAtd}<br>
                                                <b>도착 예정일 : </b>${formattedEta}<br>
                                                <b>거래일자 : </b>${formattedGdatu}
                                              </div>`
                                });
                                infowindow.open(map, marker);

                                // 클릭된 마커의 인포윈도우를 마커 객체에 저장
                                marker.infowindow = infowindow;
                            });

                            // 클릭된 마커를 제외한 다른 모든 마커의 인포윈도우 닫는 함수
                            function closeOtherInfoWindows(clickedMarker) {
                                // 모든 마커를 순회하면서 클릭된 마커를 제외한 다른 마커의 인포윈도우 닫기
                                if (markers) {
                                    markers.forEach(function(marker) {
                                        if (marker !== clickedMarker && marker.infowindow) {
                                            marker.infowindow.close();
                                        }
                                    });
                                }
                            }
                        });
                    },
                    error: function(error) {
                        console.error("Failed to fetch ship locations: ", error);
                    }
                });
    
                if (!mapContainer) {
                    console.error("맵 컨테이너를 찾을 수 없습니다.");
                    return;
                }
    

                
                
                // 마커 추가 및 클릭 이벤트 추가
                locations.forEach(function(location) {
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position: new google.maps.LatLng(location.lat, location.lng),
                        map: map,
                        title: location.name,
                        content: document.createElement('div')
                    });

                    // Set custom icon if necessary
                    const iconUrl = "../img/" + location.code + ".jpg";
                    const iconElement = marker.content;
                    iconElement.style.backgroundImage = `url(${iconUrl})`;
                    iconElement.style.width = '60px';
                    iconElement.style.height = '60px';
                    iconElement.style.backgroundSize = 'contain';
                    iconElement.style.backgroundRepeat = 'no-repeat';
                    iconElement.style.backgroundPosition = 'center';
                    
                    // markers 배열에 마커 추가
                    markers.push(marker);

                    // 클릭 이벤트 추가
                    marker.addListener('click', function() {
                        // 클릭된 마커를 제외한 다른 모든 마커의 인포윈도우 닫기
                        closeOtherInfoWindows(marker);
                        
                        // 해당 좌표로 지도 이동
                        map.panTo(marker.position);
                        
                        // 인포윈도우 표시
                        var infowindow = new google.maps.InfoWindow({
                            content: "<div><strong>" + location.name + "</strong>"
                        });
                        infowindow.open(map, marker);

                        // 클릭된 마커의 인포윈도우를 마커 객체에 저장
                        marker.infowindow = infowindow;
                    });

                    // 클릭된 마커를 제외한 다른 모든 마커의 인포윈도우 닫는 함수
                    function closeOtherInfoWindows(clickedMarker) {
                        // 모든 마커를 순회하면서 클릭된 마커를 제외한 다른 마커의 인포윈도우 닫기
                        if (markers) {
                            markers.forEach(function(marker) {
                                if (marker !== clickedMarker && marker.infowindow) {
                                    marker.infowindow.close();
                                }
                            });
                        }
                    }
                });
                // 해상 경로 추가
                sea_route.forEach(function(route, index) {
                    var pathCoordinates = route.route.map(function(coord) {
                        return new google.maps.LatLng(coord.lat, coord.lng);
                    });

                    var strokeColor = getStrokeColor(index); // 각 객체에 맞는 색상을 가져오는 함수 호출

                    var polyline = new google.maps.Polyline({
                        path: pathCoordinates,
                        geodesic: true,
                        strokeColor: strokeColor,
                        strokeOpacity: 0.5,
                        strokeWeight: 2
                    });

                    polyline.setMap(map);
                });
                

                // 각 객체에 맞는 색상을 반환하는 함수 예시
                function getStrokeColor(index) {
                    // 각 객체에 따라 다른 색상을 지정
                    switch (index % 3) { // 예시로 3가지 색상을 순환하도록 설정
                        case 0:
                            return '#FF0000'; // 빨간색
                        case 1:
                            return '#00FF00'; // 초록색
                        case 2:
                            return '#0000FF'; // 파란색
                        default:
                            return '#000000'; // 기본값 검정색
                    }
                } 
            }
            
        });
    });
