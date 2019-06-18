(function() {

    // WA COUNTIES
    var counties = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Boundaries/WADNR_PUBLIC_Cadastre_OpenData/MapServer/11",
        style: function (feature) {
            return {
                color: '#000000',
                weight: 1.5,
            };
        },
        precision: 10,
        pane: "boundaries"
    });

    // DNR REGIONS
    var regions = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Boundaries/WADNR_PUBLIC_Cadastre_OpenData/MapServer/3",
        style: function (feature) {
            return {
                color: '#000000',
                weight: 1.5,
            };
        },
        pane: "boundaries"
    });

    // NWCC Daily Fires
    // Icon made by Vectors Market from Flaticon.com
    var fireIcon = L.icon({
        iconUrl: "../../../static/images/flame.svg",
        iconSize: [27, 27], // size of the icon
        });

    var daily_fires = L.esri.featureLayer({
        url: "https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/NWCC_Operational_Layers/FeatureServer/1",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fireIcon});
    },
        ignoreRenderer: true,
        pane: "points",
    });

    daily_fires.bindPopup(function(evt) {
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
            "<div class='row'>" +
                "<div class='col-xs-12' style='padding:0;'>" +
                    "<div class='table-responsive'>" +
                        "<table class='table table-sm' style='font-size: 1em'>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th colspan='4' class='dnr-blue-bg text-light' style='font-weight: 700;'>{FIRE_NM}</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td style='font-weight: 700;'>Status</td>" +
                                    "<td class='text-muted'>{STATUS}</td>" +
                                    "<td style='font-weight: 700;'>Acres</td>" +
                                    "<td class='text-muted'>{RPTD_ACRES}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td style='font-weight: 700;'>Start Date</td>" +
                                    "<td class='text-muted'>{START_DATE}</td>" +
                                    "<td style='font-weight: 700;'>IMT Type</td>" +
                                    "<td class='text-muted'>{IMT_TYPE}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td style='font-weight: 700;'>IC/Team Name</td>" +
                                    "<td class='text-muted'>{IC_NM}</td>" +
                                    "<td style='font-weight: 700;'>Complex</td>" +
                                    "<td class='text-muted'>{COMPLEX}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td style='font-weight: 700;'>Cause</td>" +
                                    "<td class='text-muted'>{CAUSE}</td>" +
                                    "<td style='font-weight: 700;'>Unit ID</td>" +
                                    "<td class='text-muted'>{COMPLEX}</td>" +
                                "</tr>" +
                            "</tbody>" +
                        "</table>" + //table
                    "</div>" + //responsive table
                "</div>" + // col
            "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // // MODIS
    // var modis = L.esri.featureLayer({
    //     url: "https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_fires/MapServer/4",
    //
    // });
    //
    // // VIIRS
    // var viirs = L.esri.featureLayer({
    //     url: "https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_fires/MapServer/5",
    //     style: function (feature) {
    //         return {
    //             color: '#000000',
    //             weight: 2,
    //         };
    //     }
    // });


    // NWS WATCHES AND WARNINGS
    var NWS_warnings = L.esri.featureLayer({
        url: 'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/1',
        style: function (feature) {
            return {
                stroke: false,
                fillOpacity: '0.5',
            };
        },
        where:"wfo IN ('KSEW', 'KOTX', 'KPDT', 'KBOI', 'KMFR', 'KPQR', 'KMSO')",
        pane: 'overlays'
    });


    NWS_warnings.bindPopup(function(evt) {
        var t = moment.utc(evt.feature.properties['expiration']).local().fromNow();
        var s = moment.utc(evt.feature.properties['issuance']).local().fromNow();
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<a href='{url}' target='_blank' style='font-size: 1.5em; font-weight: 700; color: #003d6b;'><u>{prod_type}</u></a>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='font-weight: 700;'>" +
        "Issued: " + s +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Expires " + t +
        "</span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // NWS 7-DAY RAINFALL
    var NWS_QPE = L.esri.featureLayer({
        url: 'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/wpc_qpf/MapServer/11',
        simplifyFactor: 1,
        style: function (feature) {
            return {
                stroke: false,
                fillOpacity: '0.4',
            };
        },
        pane: 'overlays'
    });

    NWS_QPE.bindPopup(function(evt) {
        var t = moment.utc(evt.feature.properties['end_time']).local().format('dddd, MMMM Do YYYY');

        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span'>7-Day Rainfall Forecast</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0; text-align: center'>" +
        "<span style='font-size: 2em; font-weight: 700;color: #003d6b;'>{qpf} inches</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Valid until " + t + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // CPC MONTHLY DROUGHT
    var CPC_Monthly_Drought = L.esri.featureLayer({
        url: 'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Climate_Outlooks/cpc_drought_outlk/MapServer/0',
        simplifyFactor: 1,
        style: function (feature) {
              if(feature.properties.fid_improv === 1){
                return {fillColor: '#DED3BC', fillOpacity: '0.5', stroke: false};
              } else if(feature.properties.fid_persis === 1){
                return {fillColor: '#9B634A', fillOpacity: '0.5', stroke: false};
              } else if(feature.properties.fid_dev === 1){
                return {fillColor: '#FFDE62', fillOpacity: '0.5', stroke: false};
              } else if (feature.properties.fid_remove === 1){
                return {fillColor: '#B2AD69', fillOpacity: '0.5', stroke: false};
              } else {
                return { fillOpacity: '0.5', stroke: false};
              }
            },
        pane: 'overlays'
    });

    CPC_Monthly_Drought.bindPopup(function(evt) {
        if(evt.feature.properties.fid_improv === 1){
            var drought_status = 'improve';
        } else if(evt.feature.properties.fid_persis === 1){
            var drought_status = 'continue ';
        } else if(evt.feature.properties.fid_dev === 1){
            var drought_status = 'develop';
        } else if(evt.feature.properties.fid_remove === 1){
            var drought_status = 'end';
        }
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='text-align: center;'>One-Month Drought Outlook</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='font-size: 1.2em; font-weight: 700; color: #003d6b;'>Drought will likely " + drought_status + " in this area</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Valid until {target}</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'><a href='https://www.cpc.ncep.noaa.gov/products/expert_assessment/mdo_summary.php' target='_blank'> More Info</a></span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // CPC SEASONAL OUTLOOK
    var CPC_Seasonal_Drought = L.esri.featureLayer({
        url: 'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Climate_Outlooks/cpc_drought_outlk/MapServer/1',
        simplifyFactor: 1,
        style: function (feature) {
              if(feature.properties.fid_improv === 1){
                return {fillColor: '#DED3BC', fillOpacity: '0.5', stroke: false};
              } else if(feature.properties.fid_persis === 1){
                return {fillColor: '#9B634A', fillOpacity: '0.5', stroke: false};
              } else if(feature.properties.fid_dev === 1){
                return {fillColor: '#FFDE62', fillOpacity: '0.5', stroke: false};
              } else if (feature.properties.fid_remove === 1){
                return {fillColor: '#B2AD69', fillOpacity: '0.5', stroke: false};
              } else {
                return { fillOpacity: '0.5', stroke: false};
              }
            },
        pane: 'overlays'
    });

    CPC_Seasonal_Drought.bindPopup(function(evt) {
        if(evt.feature.properties.fid_improv === 1){
            var drought_status = 'improve';
        } else if(evt.feature.properties.fid_persis === 1){
            var drought_status = 'continue ';
        } else if(evt.feature.properties.fid_dev === 1){
            var drought_status = 'develop';
        } else if(evt.feature.properties.fid_remove === 1){
            var drought_status = 'end';
        }
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='text-align: center;'>Three-Month Drought Outlook</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='font-size: 1.2em; font-weight: 700;color: #003d6b;'>Drought will likely " + drought_status + " in this area</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Valid until {target}</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'><a href='https://www.cpc.ncep.noaa.gov/products/expert_assessment/sdo_summary.php' target='_blank'> More Info</a></span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    var baseLayers = {
        "Topographic": L.esri.basemapLayer("Topographic"),
        "Satellite": L.esri.basemapLayer("Imagery"),
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
        layers: [NWS_warnings, daily_fires, regions]
    });

    map.createPane('boundaries');
    map.createPane('overlays');
    map.createPane('points');


    L.easyButton('fa-home', function (btn, map) {
        map.setView([home.lat, home.lng], home.zoom);
    }, 'Zoom To Home').addTo(map);


    L.esri.basemapLayer("Topographic").addTo(map);

    var groupedOverlays = {
      "Boundaries": {
        "Counties": counties,
        "DNR Regions": regions
      },
      "Fires": {
        "NWCC Large Fires": daily_fires,
        "DNR Incidents": daily_fires,
        "Satellite Hotspots": daily_fires

      },
      "Weather": {
        "NWS Current Warnings": NWS_warnings,
        "NWS 7-Day Rain Forecast": NWS_QPE,
        "1-Month Drought Outlook": CPC_Monthly_Drought,
        "3-Month Drought Outlook": CPC_Seasonal_Drought
      }
    };

    L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);
    $( ".leaflet-control-layers-base" ).prepend( "<label class=\"leaflet-control-layers-group-label\"><span class=\"leaflet-control-layers-group-name\">Basemaps</span></label>" );
    $( "#leaflet-control-layers-group-1" ).after( "<div class='leaflet-control-layers-separator'></div>" );
    $( "#leaflet-control-layers-group-2" ).after( "<div class='leaflet-control-layers-separator'></div>" );

    map.setMaxBounds(map.getBounds());

}(this));



