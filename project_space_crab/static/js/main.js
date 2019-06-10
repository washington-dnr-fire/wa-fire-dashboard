(function() {


    var counties = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Boundaries/WADNR_PUBLIC_Cadastre_OpenData/MapServer/11",
        style: function (feature) {
            return {color: '#000000', weight: 2};
        }
    });

    var regions = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Boundaries/WADNR_PUBLIC_Cadastre_OpenData/MapServer/3/",
        style: function (feature) {
            return {weight: 2};
        }
    });

    var baseLayers = {
        "Topographic": L.esri.basemapLayer("Topographic"),
        "Satellite": L.esri.basemapLayer("Imagery"),
        "Terrain": L.esri.basemapLayer("Terrain"),
        "Streets": L.esri.basemapLayer("Streets")
    };

    var overlays = {
        "Counties": counties,
        "DNR Regions": regions,
        "Large Fires": counties,
        "DNR IA Fires": counties,
    };

    var home = {
        lat: 47.3826,
        lng: -120.4472,
        zoom: 6
    };
    var map = L.map('mapdiv', {
        center: [home.lat, home.lng],
        zoom: home.zoom,
        minZoom: 6,
        layers: [L.esri.basemapLayer("Topographic"), counties]
    });

    L.easyButton('fa-home', function (btn, map) {
        map.setView([home.lat, home.lng], home.zoom);
    }, 'Zoom To Home').addTo(map);


    L.esri.basemapLayer("Topographic").addTo(map);

    L.control.layers(baseLayers, overlays).addTo(map);
    map.setMaxBounds(map.getBounds());

    var ctx = document.getElementById('chart1').getContext('2d');
    var chart1 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                pointRadius: 2,
                fill: false,
                lineTension: 0,
                label: 'Current Year',
                data: [0, 4, 10, 20, 70, 150],
                borderColor: '#000000',
                borderWidth: 2
            }, {
                pointRadius: 2,
                fill: false,
                lineTension: 0,
                label: 'Max Year',
                data: [3, 19, 28, 100, 150, 175],
                borderColor: '#ff0000',
                borderWidth: 2
                }, {
                pointRadius: 2,
                fill: false,
                lineTension: 0,
                label: 'Min Year',
                data: [0, 2, 5, 8, 20, 30],
                borderColor: '#0000ff',
                borderWidth: 2
                }
            ]
        },
        options: {
            scales: {

               yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Fires to Date'
						}
					}]
            }
        }
    });

}(this));
