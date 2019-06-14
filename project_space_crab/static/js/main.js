(function() {


    var counties = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Boundaries/WADNR_PUBLIC_Cadastre_OpenData/MapServer/11"
    });

    var regions = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Boundaries/WADNR_PUBLIC_Cadastre_OpenData/MapServer/3"
    });

    var wa_large_fires = L.esri.featureLayer({
        url: 'https://gis.dnr.wa.gov/site3/rest/services/Public_Wildfire/WADNR_PUBLIC_WD_WildFire_Data/MapServer/0'
    });

    wa_large_fires.bindPopup(function(evt) {
        return L.Util.template('<strong>{FIRENAME}</strong><hr /><p>Fire Year: {YEAR} <br> Acres Burned: {ACRES}</p>', evt.feature.properties);
    }); 

    var wa_fire_statistics = L.esri.featureLayer({
        url:'https://gis.dnr.wa.gov/site3/rest/services/Public_Wildfire/WADNR_PUBLIC_WD_WildFire_Data/MapServer/2'
    });

    wa_fire_statistics.bindPopup(function(evt) {
        return L.Util.template('<strong>{INCIDENT_NM}</strong><hr /><p>Cause: {FIREGCAUSE_LABEL_NM} <br> Acres Burned: {ACRES_BURNED}</p>', evt.feature.properties);
    }); 

    var viirs = L.esri.featureLayer({
        url: 'https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_fires/MapServer/5/'
    });


    var baseLayers = {
        "Topographic": L.esri.basemapLayer("Topographic"),
        "Satellite": L.esri.basemapLayer("Imagery"),
        "Terrain": L.esri.basemapLayer("Terrain"),
        "Streets": L.esri.basemapLayer("Streets")
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
        layers: [wa_fire_statistics, regions]
    });

    L.easyButton('fa-home', function (btn, map) {
        map.setView([home.lat, home.lng], home.zoom);
    }, 'Zoom To Home').addTo(map);


    L.esri.basemapLayer("Topographic").addTo(map);

    var overlays = {
        "Counties": counties,
        "DNR Regions": regions,
        "WA Fire Stats (2019)": wa_fire_statistics,
        "WA Large Fires": wa_large_fires,
        "VIIRS Hot Spots": viirs
    };

    L.control.layers(baseLayers, overlays).addTo(map);
    map.setMaxBounds(map.getBounds());




    // var ctx = document.getElementById('chart1').getContext('2d');
    // var chart1 = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //         datasets: [{
    //             pointRadius: 2,
    //             fill: false,
    //             lineTension: 0,
    //             label: 'Current Year',
    //             data: [0, 4, 10, 20, 70, 150],
    //             borderColor: '#000000',
    //             borderWidth: 2
    //         }, {
    //             pointRadius: 2,
    //             fill: false,
    //             lineTension: 0,
    //             label: 'Max Year',
    //             data: [3, 19, 28, 100, 150, 175],
    //             borderColor: '#ff0000',
    //             borderWidth: 2
    //             }, {
    //             pointRadius: 2,
    //             fill: false,
    //             lineTension: 0,
    //             label: 'Min Year',
    //             data: [0, 2, 5, 8, 20, 30],
    //             borderColor: '#0000ff',
    //             borderWidth: 2
    //             }
    //         ]
    //     },
    //     options: {
    //         scales: {
    //
    //            yAxes: [{
	// 					scaleLabel: {
	// 						display: true,
	// 						labelString: 'Fires to Date'
	// 					}
	// 				}]
    //         }
    //     }
    // });

}(this));
