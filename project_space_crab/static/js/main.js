$(function() {

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

    // DNR IFPLs
    var ifpl = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Wildfire/WADNR_PUBLIC_WD_WildFire_EGP_Portal/MapServer/11",
        pane: "overlays",
        style: function (feature) {
            return {
                color: '#000000',
                fillOpacity: '0.5',
            };
        },
    });

    // DNR IFPLs popup template
    ifpl.bindPopup(function(evt) {
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='text-align: center;'>Zone {ZONE}</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='font-size: 1.5em; font-weight:bolder;color: #003d6b;'>Level {FIRE_PRECAUTION_LEVEL} </span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<p class='text-muted'>{NOTES_TXT}</p>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span>ISSUED BY: DNR {RNG_NM} REGION &nbsp;&nbsp;<a class='popup-a-link' href='mailto:{RGN_EMAIL}'><i class='fas fa-envelope' style='color: #003d6b!important;'></i></a></span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties

    )});

    // DNR FIRE DANGER
    var firedanger = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Wildfire/WADNR_PUBLIC_WD_WildfireDanger/MapServer/0",
        pane: "overlays",
        style: function (feature) {
            return {
                color: '#000000',
                fillOpacity: '0.5',
            };
        },
    });

    // DNR FIRE DANGER POPUP TEMPLATE
    firedanger.bindPopup(function(evt) {
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='text-align: center;'>{FIREDANGER_AREA_NM}</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='font-size: 1.5em; font-weight:bolder;color: #003d6b;'>{FIRE_DANGER_LEVEL_NM} Fire Danger</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<p class='text-muted'>{NOTES_TXT}</p>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span>ISSUED BY: DNR {DNR_REGION_NAME} REGION &nbsp;&nbsp;<a class='popup-a-link' href='mailto:{REGION_EMAIL_ADDR}'><i class='fas fa-envelope' style='color: #003d6b!important;'></i></a></span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties

    )});

    // NWCC daily fires icon
    // Icon made by Vectors Market from Flaticon.com
    var fireIcon = L.icon({
        iconUrl: "../../../static/images/flame.svg",
        iconSize: [27, 27], // size of the icon
        });

    // NWCC DAILY FIRES
    var daily_fires = L.esri.featureLayer({
        url: "https://services3.arcgis.com/T4QMspbfLg3qTGWY/ArcGIS/rest/services/NWCC_Operational_Layers/FeatureServer/1",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fireIcon});
            },
        ignoreRenderer: true,
        pane: "points",
    });

    // NWCC daily fires popup
    daily_fires.bindPopup(function(evt) {
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
            "<div class='row'>" +
                "<div class='col-xs-12' style='padding:0;'>" +
                    "<div class='table-responsive'>" +
                        "<table class='table table-sm' style='font-size: 1em'>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th colspan='4' class='' style='font-size: 1.5em; font-weight:bolder;color: #003d6b; border-top: none;'>{FIRE_NM}</th>" +
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
                    "<span class='text-muted'><small>Source: Northwest Coordination Center</small></span>" +
                "</div>" + // col
            "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // egp stuff, layer_ids match the EGP Active Incidents Feature Service
    var large_imsr_type1 = new L.GeoJSON.AJAX("./egp_data/0",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fireIcon});
        },
        pane: "points",
    });  

    var large_imsr_type2 = new L.GeoJSON.AJAX("./egp_data/1",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fireIcon});
        },
        pane: "points",
    });  

    var large_imsr_other = new L.GeoJSON.AJAX("./egp_data/2",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fireIcon});
        },
        pane: "points",
    });     


    var other_209 = new L.GeoJSON.AJAX("./egp_data/3",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fireIcon});
        },
        pane: "points",
    });     

    var emerging_incidents_less24 = new L.GeoJSON.AJAX("./egp_data/4",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fireIcon});
        },
        pane: "points",
    });
    
    emerging_incidents_less24.bindPopup(function(evt){
        return L.Util.template(
            evt.feature.properties.popupinfo,
    )});
    
    var emerging_incidents_greater24 = new L.GeoJSON.AJAX("./egp_data/5",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: fireIcon});
        },
    });      

    var egp_data_active_incidents = L.layerGroup([large_imsr_type1,large_imsr_type2,large_imsr_other,other_209,emerging_incidents_less24,emerging_incidents_greater24]);

    // HMS SATELLITE DETECTIONS
    var hms_detects = L.esri.featureLayer({
        url: "https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/6",
        where:"load_stat IN ('Active Burning', '24 Hrs', '48 Hrs')",
        pane: "points",
    });

    // HMS satellite detections popup template
    hms_detects.bindPopup(function(evt) {
        if(evt.feature.properties.load_stat === "Active Burning"){
            var load_stat = 'Last 12 hours';
        } else if(evt.feature.properties.load_stat === "24 Hrs"){
            var load_stat = 'Last 12-24 hours ';
        } else if(evt.feature.properties.load_stat === "48 Hrs"){
            var load_stat = 'Last 24-48 hours';
        }
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span'>Hot Spot Detection</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0; text-align: center'>" +
        "<span style='font-size: 2em; font-weight: 700;color: #003d6b;'>" + load_stat + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Detected via {det_method} and the {satellite} satellite</span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

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

    // NWS watches and warnings popup template
    NWS_warnings.bindPopup(function(evt) {
        var t = moment.utc(evt.feature.properties['expiration']).local().fromNow();
        var s = moment.utc(evt.feature.properties['issuance']).local().fromNow();
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<a class='popup-a-link' href='{url}' target='_blank' style='font-size: 1.5em; font-weight: 700;'>{prod_type}</a>" +
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

    // NWS 7-day rainfall popup template
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

    // CPC monthly drought popup template
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
        "<span class='text-muted'><a class='popup-a-link' href='https://www.cpc.ncep.noaa.gov/products/expert_assessment/mdo_summary.php' target='_blank'> More Info</a></span>" +
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

    // CPC seasonal drought popup template
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
        "<span class='text-muted'><a class='popup-a-link' href='https://www.cpc.ncep.noaa.gov/products/expert_assessment/sdo_summary.php' target='_blank'> More Info</a></span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // Map base layers
    var baseLayers = {
        "Topographic": L.esri.basemapLayer("Topographic"),
        "Satellite": L.esri.basemapLayer("Imagery"),
    };

    // Home point
    var home = {
        lat: 47.3826,
        lng: -120.4472,
        zoom: 7
    };

    // Actual map instance
    var map = L.map('mapdiv', {
        center: [home.lat, home.lng],
        zoom: home.zoom,
        minZoom: 7,
        layers: [NWS_warnings, daily_fires, hms_detects, regions],
        attributionControl: false,
        cursor: false
    });

    // Add a basemap to map
    L.esri.basemapLayer("Topographic").addTo(map);

    // Set zoom control to bottom right
    map.zoomControl.setPosition('bottomright');

    // Create sidebar instance and add it to the map
    var sidebar = L.control.sidebar({ container: 'sidebar', autopan: true, closeButton: true })
        .addTo(map)
        .open('home');

    // Create panes to handle z-index stuff and be tidy
    map.createPane('boundaries');
    map.createPane('overlays');
    map.createPane('points');

    // Add a button for zooming to home view on click
    L.easyButton('fa-home', function (btn, map) {
        map.setView([home.lat, home.lng], home.zoom);
    }, 'Zoom to home', {
        position: 'bottomright'
    }).addTo(map);

    // Add a button for geolocation, has built in error handling
    L.control.locate({
        position: 'bottomright',
        returnToPrevBounds: true,
        icon: 'fas fa-location-arrow',
        showPopup: false,
        locateOptions: {
               maxZoom: 13
        }
    }).addTo(map);

    // Create empty layergroup for weather forecast points
    var weatherGroup = L.layerGroup();

    var weatherbutton = L.easyButton({
        states: [{
            stateName: 'get-forecast',
            icon: 'fa-bolt fa-rotate-15',
            title: 'Get weather forecast',
            onClick: function(control) {
                // Change to clicked state in case they dont want to do anything
                control.state('remove-forecast');
                map.on('click', function (e) {
                    control.state('loading');
                    var popLocation = e.latlng;
                    var popup = L.popup()
                        .setLatLng(popLocation)
                        .setContent(
                            "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
                            "<div class='row'>" +
                            "<div class='col-xs-12' style='padding:0;'>" +
                            "<p>Loading...</p>" +
                            "</div>" + // col
                            "</div>" + // row
                            "</div>"
                        ).openOn(map);
                    var lat = e.latlng.lat.toString();
                    var lon = e.latlng.lng.toString();
                    $.getJSON('https://api.weather.gov/points/' + lat + ',' + lon, function (data) {
                        $.getJSON(data.properties.forecastGridData, function (data) {
                            console.log(data);
                            var t = moment.utc(data.properties.updateTime).local().fromNow();
                            var popLocation = e.latlng;
                            var popup = L.popup()
                                .setLatLng(popLocation)
                                .setContent(
                                    "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
                                    "<div class='row'>" +
                                    "<div class='col-xs-12' style='padding:0;'>" +
                                    "<span style='text-align: center;'>NWS forecast for " + e.latlng.lat.toFixed(3).toString() + ", " + e.latlng.lng.toFixed(3).toString() + "</span>" +
                                    "</div>" + // col
                                    "</div>" + // row
                                    "<div class='row'>" +
                                    "<div class='col-xs-12' style='padding:0;'>" +
                                    "<span class='text-left text-muted'>Last updated " + t  + "</span>" +
                                    "</div>" + // col
                                    "</div>" + // row
                                    "<div class='row'>" +
                                    "<div class='col-xs-12' style='padding:0;'>" +
                                    "<span class='text-left text-muted'>Grid elevation: " + (data.properties.elevation.value * 3.28084).toFixed(0) + " ft</span>" +
                                    "</div>" + // col
                                    "</div>" + // row
                                    "</div>" // container
                                    ).openOn(map);
                            control.state('remove-forecast');
                        });
                    });
                });
            }
            }, {
            icon: 'fa-bolt fa-rotate-15 clicked-color',
            stateName: 'remove-forecast',
            title: 'Remove forecast',
            onClick: function(control) {
                map.removeLayer(markerGroup);
                control.state('get-forecast');
            }
            }, {
            icon: 'fa-spinner fa-spin',
            stateName: 'loading',
        }],
        position: 'bottomright'
    }).addTo(map);

    // Create groupings of overlays for layer pick list
    var groupedOverlays = {
      "Boundaries": {
        "Counties": counties,
        "DNR Regions": regions
      },
      "Fires": {
        "NWCC Large Fires": daily_fires,
        "EGP Active Incidents": egp_data_active_incidents,
        "Satellite Hotspots": hms_detects
      },
      "Fire Risk":{
          "DNR Fire Danger": firedanger,
          "IFPLs": ifpl
      },
      "Weather": {
        "NWS Current Warnings": NWS_warnings,
        "NWS 7-Day Rain Forecast": NWS_QPE,
        "1-Month Drought Outlook": CPC_Monthly_Drought,
        "3-Month Drought Outlook": CPC_Seasonal_Drought
      }
    };

    // Add layer group control to map
    L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);

    // Add some pretty to layer control
    $( ".leaflet-control-layers-base" ).prepend( "<label class=\"leaflet-control-layers-group-label\"><span class=\"leaflet-control-layers-group-name\">Basemaps</span></label>" );
    $( "#leaflet-control-layers-group-1" ).after( "<div class='leaflet-control-layers-separator'></div>" );
    $( "#leaflet-control-layers-group-2" ).after( "<div class='leaflet-control-layers-separator'></div>" );
    $( "#leaflet-control-layers-group-3" ).after( "<div class='leaflet-control-layers-separator'></div>" );

    //map bounces back and forth using this for some reason
    // map.setMaxBounds(map.getBounds());

    });