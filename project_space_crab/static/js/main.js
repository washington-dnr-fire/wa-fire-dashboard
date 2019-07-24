$(function() {

    // disable service worker until it's figured out
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./serv-worker.js');
    };

  // Positive polarity lightning icon
    var redLightningIcon = L.icon({
    iconUrl: "../../../static/images/red_lightning.svg",
    iconSize: [20, 20], // size of the icon
    });

    // Negative polarity lightning icon
    var blueLightningIcon = L.icon({
    iconUrl: "../../../static/images/blue_lightning.svg",
    iconSize: [20, 20], // size of the icon
    });

    var lightning = L.markerClusterGroup({
        polygonOptions: {color: '#7F7F7F'},
        clusterPane: 'lightningclusters',
        maxClusterRadius: 100
        }
    );

    // BLM 24hr Lightning
    var blm_lightning_24hr = new L.GeoJSON.AJAX("./egp_data/blm_lightning/1", {
        pointToLayer: function (feature, latlng) {
            if(feature.properties.Polarity === 'N'){
                return L.marker(latlng, {icon: blueLightningIcon});
            } else if(feature.properties.Polarity === 'P'){
                return L.marker(latlng, {icon: redLightningIcon});
            }
        },
        onEachFeature: function (feature, layer) {
            var lat = feature.properties.Latitude.toFixed(3).toString();
            var lng = feature.properties.Longitude.toFixed(3).toString();
            var t = moment(feature.properties.TimeStamp).local().fromNow();
            layer.bindPopup(L.Util.template(
                "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
                "<div class='row'>" +
                "<div class='col-xs-12' style='padding:0;'>" +
                "<span>Lightning detected at " + lat + ', ' + lng + "</span>" +
                "</div>" + // col
                "</div>" + // row
                "<div class='row'>" +
                "<div class='col-xs-12' style='padding:0;'>" +
                "<span style='font-size: 2em; font-weight: 700;color: #003d6b;'>" + t  + "</span>" +
                "</div>" + // col
                "</div>" + // row
                "<div class='row'>" +
                "<div class='col-xs-6' style='padding:0;'>" +
                "<span>Polarity: { Polarity } </span>" +
                "</div>" + // col
                "<div class='col-xs-6 ml-2' style='padding:0;'>" +
                "<span>Current: { CurrentMeasurement } kA</span>" +
                "</div>" + // col
                "</div>" + // row
                "</div>"
            , feature.properties
            ))
        }
    });

    blm_lightning_24hr.on('data:loaded', function () {
        lightning.addLayer(blm_lightning_24hr);
    });

    function titleCase(str) {
        return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
    }

    // Contextual colors for Situation Snapshot cards, gross
    if($('#nw_id').text() == 1){
        $('#northwestprep').css('backgroundColor', '#218c71');
    } else if(2 <= $('#nw_id').text() && $('#nw_id').text() <= 3){
        $('#northwestprep').css('backgroundColor', '#F1B34D');
    } else if(4 <= $('#nw_id').text() && $('#nw_id').text() <= 5){
        $('#northwestprep').css('backgroundColor', '#CA304B');
    }
    if($('#nat_id').text() == 1){
        $('#nationalprep').css('backgroundColor', '#218c71');
    } else if(2 <= $('#nat_id').text() && $('#nat_id').text() <= 3){
        $('#nationalprep').css('backgroundColor', '#218c71');
    } else if($('#nat_id').text() > 3){
        $('#nationalprep').css('backgroundColor', '#218c71');
    }
    if($('#type1_id').text() == 0){
        $('#type1teams').css('backgroundColor', '#218c71');
    } else if($('#type1_id').text() == 1){
        $('#type1teams').css('backgroundColor', '#F1B34D');
    } else if($('#type1_id').text() > 1 ){
        $('#type1teams').css('backgroundColor', '#CA304B');
    }
    if(0 <= $('#type2_id').text() && $('#type2_id').text() <= 2){
        $('#type2teams').css('backgroundColor', '#218c71');
    } else if(2 <= $('#type2_id').text() && $('#type2_id').text() <= 4){
        $('#type2teams').css('backgroundColor', '#F1B34D');
    } else if($('#type2_id').text() >= 4){
        $('#type2teams').css('backgroundColor', '#CA304B');
    }
    if(0 <= $('#wafires_id').text() && $('#wafires_id').text() <= 2){
        $('#walargefires').css('backgroundColor', '#218c71');
    } else if(3 <= $('#wafires_id').text() && $('#wafires_id').text() <= 4){
        $('#walargefires').css('backgroundColor', '#F1B34D');
    } else if($('#wafires_id').text() > 4 ){
        $('#walargefires').css('backgroundColor', '#CA304B');
    }
    if(0 <= $('#dnrfires_id').text() && $('#dnrfires_id').text() <= 4){
        $('#dnrfires').css('backgroundColor', '#218c71');
    } else if(5 <= $('#dnrfires_id').text() && $('#dnrfires_id').text() <= 10){
        $('#dnrfires').css('backgroundColor', '#F1B34D');
    } else if($('#dnrfires_id').text() > 10 ){
        $('#dnrfires').css('backgroundColor', '#CA304B');
    }

    // NWS WATCHES AND WARNINGS
    var NWS_warnings = L.esri.featureLayer({
        url: 'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/1',
        style: function (feature) {
            return {
                stroke: false,
                fillOpacity: '0.5',
            };
        },
        where:"wfo IN ('KSEW', 'KOTX', 'KPDT', 'KPQR')",
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
        "<span>National Weather Service Product</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='font-size: 2em; font-weight: 700;color: #003d6b;'>{prod_type}</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='font-weight: 700;'>" +
        "Start: " + s +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Expires " + t +
        "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<a target='_blank' href='{url}' rel='noreferrer'>More info</a> " +
        "</a>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // WA COUNTIES
    var counties = new L.GeoJSON.AJAX("../../../static/spatial_data/wa_county_boundaries.geojson",{
        style: function (feature){
            return {
                color: '#000000',
                weight: 1.5,
                fillOpacity: 0,
            };
        },
        pane: "boundaries",
    });  

    // DNR REGIONS
    var regions = new L.GeoJSON.AJAX("../../../static/spatial_data/wa_dnr_regions.geojson",{
        style: function (feature){
            return {
                color: '#000000',
                weight: 1.5,
                fillOpacity: 0,
            };
        },
        pane: "boundaries",
    });

    // DNR IFPLs
    var ifpl = L.esri.dynamicMapLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Wildfire/WADNR_PUBLIC_WD_IFPL/MapServer",
        layers: [0],
        pane: "overlays",
        opacity: 0.7,
    });

    // DNR IFPLs popup template
    ifpl.bindPopup(function(error, featureCollection) {
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='text-align: center;'>Zone " + featureCollection.features[0].properties["Shutdown Zone"] + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='font-size: 1.5em; font-weight:bolder;color: #003d6b;'>Level " + featureCollection.features[0].properties["Fire Precaution Level"] + " </span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<p class='text-muted'>" + featureCollection.features[0].properties["Comments"] + "</p>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span>ISSUED BY: DNR " + featureCollection.features[0].properties["Region"] + " REGION &nbsp;&nbsp;<a class='popup-a-link' href='mailto:" + featureCollection.features[0].properties["Email"]+ "'><i class='fas fa-envelope' style='color: #003d6b!important;'></i></a></span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", featureCollection.features[0].properties 

    )});

    // DNR FIRE DANGER
    var firedanger = L.esri.dynamicMapLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Wildfire/WADNR_PUBLIC_WD_WildfireDanger/MapServer",
        layers: [0],
        pane: "overlays",
        opacity: 0.7,
    });

    // DNR FIRE DANGER POPUP TEMPLATE
    firedanger.bindPopup(function(error, featureCollection) {
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='text-align: center;'>" + featureCollection.features[0].properties.FIREDANGER_AREA_NM + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span style='font-size: 1.5em; font-weight:bolder;color: #003d6b;'>" + featureCollection.features[0].properties.FIRE_DANGER_LEVEL_NM + " Fire Danger</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<p class='text-muted'>" + featureCollection.features[0].properties.NOTES_TXT + "</p>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span>ISSUED BY: DNR " + featureCollection.features[0].properties.DNR_REGION_NAME + " REGION &nbsp;&nbsp;<a class='popup-a-link' href='mailto:" + featureCollection.features[0].properties.REGION_EMAIL_ADDR + "'><i class='fas fa-envelope' style='color: #003d6b!important;'></i></a></span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", featureCollection.features[0].properties 

    )});

    // NWCC daily fires icon
    var fireIcon = L.icon({
        iconUrl: "../../../static/images/Flames_Large.svg",
        iconSize: [25, 25],
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

    // SIT209 Fires icon
    var LargeFireIcon = L.icon({
        iconUrl: "../../../static/images/Flames_Emerging.svg",
        iconSize: [20, 20],
        });

    // SIT209 yuggggeeee fires
    var large_fires = new L.GeoJSON.AJAX("./egp_data/active_incidents/0",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: LargeFireIcon});
        },
        pane: "points",
    });  
    large_fires.bindPopup(function(evt) {
        var lat = evt.feature.geometry.coordinates[1].toFixed(3);
        var lng = evt.feature.geometry.coordinates[0].toFixed(3);
        var t = moment(evt.feature.properties.FireDiscoveryDateTime).local().fromNow();
        return L.Util.template(
            "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
            "<div class='row'>" +
            "<div class='col-xs-12' style='padding:0;'>" +
            "<span>Large fire at " + lat + ', ' + lng + "</span>" +
            "</div>" + // col
            "</div>" + // row
            "<div class='row'>" +
                "<div class='col-xs-12' style='padding:0;'>" +
                    "<div class='table-responsive'>" +
                        "<table class='table table-sm' style='font-size: 1em; margin-bottom: 0;'>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th colspan='4' class='mx-0 px-0' style='font-size: 2em; font-weight: 700;color: #003d6b; border-top: none;'>" + titleCase(evt.feature.properties.Name) + "</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Incident #</td>" +
                                    "<td class='text-muted' colspan='3'>{UniqueFireIdentifier}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Start</td>" +
                                    "<td class='text-muted'>" + t + "</td>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Dispatch</td>" +
                                    "<td class='text-muted'>{DispatchCenterID}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Acres</td>" +
                                    "<td class='text-muted'>{DailyAcres}</td>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Cause</td>" +
                                    "<td class='text-muted'>{FireCause}</td>" +

                                "</tr>" +
                            "</tbody>" +
                        "</table>" + //table
                    "</div>" + //responsive table
                    "<span class='text-muted'><small>Source: SIT-209 Reports via NIFC EGP</small></span>" +
                "</div>" + // col
            "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // Unknown SIT209 fires, gotta catch 'em all
    var large_fires_other = new L.GeoJSON.AJAX("./egp_data/active_incidents/1",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: LargeFireIcon});
        },
        pane: "points",
    });

    large_fires_other.bindPopup(function(evt) {
        var lat = evt.feature.geometry.coordinates[1].toFixed(3);
        var lng = evt.feature.geometry.coordinates[0].toFixed(3);
        var t = moment(evt.feature.properties.FireDiscoveryDateTime).local().fromNow();
        return L.Util.template(
            "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
            "<div class='row'>" +
            "<div class='col-xs-12' style='padding:0;'>" +
            "<span>Large fire at " + lat + ', ' + lng + "</span>" +
            "</div>" + // col
            "</div>" + // row
            "<div class='row'>" +
                "<div class='col-xs-12' style='padding:0;'>" +
                    "<div class='table-responsive'>" +
                        "<table class='table table-sm' style='font-size: 1em; margin-bottom: 0;'>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th colspan='4' class='mx-0 px-0' style='font-size: 2em; font-weight: 700;color: #003d6b; border-top: none;'>" + titleCase(evt.feature.properties.Name) + "</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Incident #</td>" +
                                    "<td class='text-muted' colspan='3'>{UniqueFireIdentifier}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Start</td>" +
                                    "<td class='text-muted'>" + t + "</td>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Dispatch</td>" +
                                    "<td class='text-muted'>{DispatchCenterID}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Acres</td>" +
                                    "<td class='text-muted'>{DailyAcres}</td>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Cause</td>" +
                                    "<td class='text-muted'>{FireCause}</td>" +

                                "</tr>" +
                            "</tbody>" +
                        "</table>" + //table
                    "</div>" + //responsive table
                    "<span class='text-muted'><small>Source: SIT-209 Reports via NIFC EGP</small></span>" +
                "</div>" + // col
            "</div>" + // row
        "</div>", evt.feature.properties
    )});
    // Emerging incidents < 24 hrs icon
    var squareRedIcon = L.icon({
        iconUrl: "../../../static/images/square_red.svg",
        iconSize: [12, 12],
        });

    // Emerging incidents < 24 hrs
    var emerging_incidents_less24 = new L.GeoJSON.AJAX("./egp_data/active_incidents/2",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: squareRedIcon});
        },
        pane: "points",
    });
    
    // Emerging incidents < 24 hrs popup template
    emerging_incidents_less24.bindPopup(function(evt) {
        var lat = evt.feature.geometry.coordinates[1].toFixed(3);
        var lng = evt.feature.geometry.coordinates[0].toFixed(3);
        var t = moment(evt.feature.properties.FireDiscoveryDateTime).local().fromNow();
        return L.Util.template(
            "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
            "<div class='row'>" +
            "<div class='col-xs-12' style='padding:0;'>" +
            "<span>Emerging fire at " + lat + ', ' + lng + "</span>" +
            "</div>" + // col
            "</div>" + // row
            "<div class='row'>" +
                "<div class='col-xs-12' style='padding:0;'>" +
                    "<div class='table-responsive'>" +
                        "<table class='table table-sm' style='font-size: 1em; margin-bottom: 0;'>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th colspan='4' class='mx-0 px-0' style='font-size: 2em; font-weight: 700;color: #003d6b; border-top: none;'>" + titleCase(evt.feature.properties.Name) + "</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Incident #</td>" +
                                    "<td class='text-muted' colspan='3'>{UniqueFireIdentifier}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Start</td>" +
                                    "<td class='text-muted'>" + t + "</td>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Dispatch</td>" +
                                    "<td class='text-muted'>{DispatchCenterID}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Acres</td>" +
                                    "<td class='text-muted'>{DailyAcres}</td>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Cause</td>" +
                                    "<td class='text-muted'>{FireCause}</td>" +

                                "</tr>" +
                            "</tbody>" +
                        "</table>" + //table
                    "</div>" + //responsive table
                    "<span class='text-muted'><small>Source: <a href='http://www.wildcad.net/WildCADWeb.asp' target='_blank' rel='noreferrer'>WildCAD</a> via NIFC EGP</small></span>" +
                "</div>" + // col
            "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // Emerging Incidents > 24 hrs Icon
    var squareBlackIcon = L.icon({
        iconUrl: "../../../static/images/square_black.svg",
        iconSize: [12, 12],
        });

    // Emerging Incidents > 24 hrs
    var emerging_incidents_greater24 = new L.GeoJSON.AJAX("./egp_data/active_incidents/3",{
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: squareBlackIcon});
        },
    });      

    // Emerging incidents > 24 hrs Popup template
    emerging_incidents_greater24.bindPopup(function(evt) {
        var lat = evt.feature.geometry.coordinates[1].toFixed(3);
        var lng = evt.feature.geometry.coordinates[0].toFixed(3);
        var t = moment(evt.feature.properties.FireDiscoveryDateTime).local().fromNow();
        return L.Util.template(
            "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
            "<div class='row'>" +
            "<div class='col-xs-12' style='padding:0;'>" +
            "<span>Emerging fire at " + lat + ', ' + lng + "</span>" +
            "</div>" + // col
            "</div>" + // row
            "<div class='row'>" +
                "<div class='col-xs-12' style='padding:0;'>" +
                    "<div class='table-responsive'>" +
                        "<table class='table table-sm' style='font-size: 1em; margin-bottom: 0;'>" +
                            "<thead>" +
                                "<tr>" +
                                    "<th colspan='4' class='mx-0 px-0' style='font-size: 2em; font-weight: 700;color: #003d6b; border-top: none;'>" + titleCase(evt.feature.properties.Name) + "</th>" +
                                "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Incident #</td>" +
                                    "<td class='text-muted' colspan='3'>{UniqueFireIdentifier}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Start</td>" +
                                    "<td class='text-muted'>" + t + "</td>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Dispatch</td>" +
                                    "<td class='text-muted'>{DispatchCenterID}</td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Acres</td>" +
                                    "<td class='text-muted'>{DailyAcres}</td>" +
                                    "<td class='mx-0 px-0' style='font-weight: 700;'>Cause</td>" +
                                    "<td class='text-muted'>{FireCause}</td>" +

                                "</tr>" +
                            "</tbody>" +
                        "</table>" + //table
                    "</div>" + //responsive table
                    "<span class='text-muted'><small>Source: <a href='http://www.wildcad.net/WildCADWeb.asp' target='_blank' rel='noreferrer'>WildCAD</a> via NIFC EGP</small></span>" +
                "</div>" + // col
            "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // Layer groups for big boy fires and little boy fires
    var sit209_fires = L.layerGroup([large_fires, large_fires_other]);
    var wildcad_fires = L.layerGroup([emerging_incidents_less24,emerging_incidents_greater24]);


    // MODIS Satellite Detections
    var modis_hotspot_centroids = new L.GeoJSON.AJAX("./egp_data/hotspots/0",{
        pointToLayer: function (feature, latlng) {
            var s = moment(feature.properties.DetectionDate);
            var duration = moment.duration(moment().diff(s));
            var aa = duration.asHours();
            if(aa <= 12){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'red',
                    radius: 5,
                    fillOpacity: 1.0
                })
            } else if(12 < aa && aa <= 24){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'yellow',
                    radius: 5,
                    fillOpacity: 1.0
                })
            } else if(24 < aa && aa <= 48){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'black',
                    radius: 5,
                    fillOpacity: 1.0
                })
            }
        },
        onEachFeature: function (feature, layer) {
            layer.setStyle({pane: 'points'});
        }
    });

    // MODIS hotspots popup template
    modis_hotspot_centroids.bindPopup(function(evt) {
        var s = moment(evt.feature.properties.DetectionDate);
        var lat = evt.feature.geometry.coordinates[1].toFixed(3);
        var lng = evt.feature.geometry.coordinates[0].toFixed(3);
        var duration = moment.duration(moment().diff(s));
        var aa = duration.asHours();
        if(aa <= 12){
            var load_stat = 'Last 12 hours';
        } else if(12 < aa && aa <= 24){
            var load_stat = 'Last 12-24 hours';
        } else if(24 < aa && aa <= 48){
            var load_stat = 'Last 24-48 hours';
        }
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span>Hotspot detected at " + lat + ', ' + lng + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0; text-align: center'>" +
        "<span style='font-size: 2em; font-weight: 700;color: #003d6b;'>" + load_stat + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Detected via MODIS</span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // VIIRS Satellite Detections
    var viirs_hotspot_centroids = new L.GeoJSON.AJAX("./egp_data/hotspots/2",{
        pointToLayer: function (feature, latlng) {
            var s = moment(feature.properties.DetectionDate);
            var duration = moment.duration(moment().diff(s));
            var aa = duration.asHours();
            if(aa <= 12){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'red',
                    radius: 5,
                    fillOpacity: 1.0
                })
            } else if(12 < aa && aa <= 24){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'yellow',
                    radius: 5,
                    fillOpacity: 1.0
                })
            } else if(24 < aa && aa <= 48){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'black',
                    radius: 5,
                    fillOpacity: 1.0
                })
            }
        },
        onEachFeature: function (feature, layer) {
            layer.setStyle({pane: 'points'});
        }
    });

    // VIIRS Satellite Detections Popup
    viirs_hotspot_centroids.bindPopup(function(evt) {
        var lat = evt.feature.geometry.coordinates[1].toFixed(3);
        var lng = evt.feature.geometry.coordinates[0].toFixed(3);
        var s = moment(evt.feature.properties.DetectionDate);
        var duration = moment.duration(moment().diff(s));
        var aa = duration.asHours();
        if(aa <= 12){
            var load_stat = 'Last 12 hours';
        } else if(12 < aa && aa <= 24){
            var load_stat = 'Last 12-24 hours ';
        } else if(24 < aa && aa <= 48){
            var load_stat = 'Last 24-48 hours';
        }
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span>Hotspot detected at " + lat + ', ' + lng + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0; text-align: center'>" +
        "<span style='font-size: 2em; font-weight: 700;color: #003d6b;'>" + load_stat + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Detected via VIIRS</span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // HMS SATELLITE DETECTIONS
    var hms_detects = new L.GeoJSON.AJAX("./egp_data/HMS_detects/6", {
        pointToLayer: function (feature, latlng) {
            if(feature.properties.load_stat === 'Active Burning'){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'red',
                    radius: 5,
                    fillOpacity: 1.0
                })
            } else if(feature.properties.load_stat === '24 Hrs'){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'yellow',
                    radius: 5,
                    fillOpacity: 1.0
                })
            } else if(feature.properties.load_stat === '48 Hrs'){
                return L.circleMarker(latlng, {
                    stroke: false,
                    fillColor: 'black',
                    radius: 5,
                    fillOpacity: 1.0
                })
            }
        },
        onEachFeature: function (feature, layer) {
            layer.setStyle({pane: 'points'});
        }
    });

    hms_detects.bindPopup(function(evt) {
        var lat = evt.feature.geometry.coordinates[1].toFixed(3);
        var lng = evt.feature.geometry.coordinates[0].toFixed(3);
        if(evt.feature.properties.load_stat === 'Active Burning'){
            var load_stat = 'Last 12 hours';
        } else if(evt.feature.properties.load_stat === '24 Hrs'){
            var load_stat = 'Last 12-24 hours ';
        } else if(evt.feature.properties.load_stat === '48 Hrs') {
            var load_stat = 'Last 24-48 hours';
        }
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<span>Hotspot detected at " + lat + ', ' + lng + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0; text-align: center'>" +
        "<span style='font-size: 2em; font-weight: 700;color: #003d6b;'>" + load_stat + "</span>" +
        "</div>" + // col
        "</div>" + // row
        "<div class='row'>" +
        "<div class='col-xs-12'>" +
        "<span class='text-muted'>Detected via {det_method}</span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});

    // All da satellites group
    var satellite_detects = L.layerGroup([viirs_hotspot_centroids, modis_hotspot_centroids, hms_detects]);

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

    // Map base layers
    var baseLayers = {
        "Terrain": L.esri.basemapLayer("Topographic"),
        "Topographic": L.esri.basemapLayer("USATopo"),
        "Imagery": L.esri.basemapLayer("Imagery")
    };

    // Home point
    var home = {
        lat: 47.3902606,
        lng: -120.528331,
        zoom: 7
    };

    // Actual map instance
    var map = L.map('mapdiv', {
        center: [home.lat, home.lng],
        zoom: home.zoom,
        minZoom: 6,
        layers: [regions, NWS_warnings, satellite_detects, daily_fires, sit209_fires, wildcad_fires],
        attributionControl: false,
        cursor: false
    });

    // Get initial map bounds for easybutton later
    map_bounds = map.getBounds();

    // Create sidebar instance and add it to the map
    var sidebar = L.control.sidebar({ container: 'sidebar', autopan: true, closeButton: true })
        .addTo(map);
        // .open('home');

    // Add a basemap to map
    baseLayers.Terrain.addTo(map);

    // Create panes to handle z-index stuff and be tidy
    map.createPane('boundaries');
    map.createPane('overlays');
    map.createPane('points');
    map.createPane('lightningclusters');


    // Create groupings of overlays for layer pick list
    var groupedOverlays = {
      "Boundaries": {
        "Counties": counties,
        "DNR Regions": regions
      },
      "Fires": {
        "NWCC Large Fires": daily_fires,
        "SIT-209 Fires": sit209_fires,
        "WildCAD Fires": wildcad_fires,
        "Satellite Hotspots": satellite_detects,
      },
      "Fire Risk":{
          "DNR Fire Danger": firedanger,
          "IFPLs": ifpl
      },
      "Weather": {
        "NWS Current Warnings": NWS_warnings,
        "24-Hour Lightning Strikes": lightning,
        "NWS 7-Day Rain Forecast": NWS_QPE,
      }
    };

    // Add layer group control to map
    var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);
    L.DomEvent.disableClickPropagation(layerControl._container);
    L.DomEvent.disableScrollPropagation(layerControl._container);

    // Add some pretty to layer control
    $( ".leaflet-control-layers-base" ).prepend( "<label class=\"leaflet-control-layers-group-label\"><span class=\"leaflet-control-layers-group-name\">Basemaps</span></label>" );
    $( "#leaflet-control-layers-group-1" ).after( "<div class='leaflet-control-layers-separator'></div>" );
    $( "#leaflet-control-layers-group-2" ).after( "<div class='leaflet-control-layers-separator'></div>" );
    $( "#leaflet-control-layers-group-3" ).after( "<div class='leaflet-control-layers-separator'></div>" );

    // Set zoom control to bottom right
    map.zoomControl.setPosition('bottomright');

    // Add a button for zooming to home view on click
    L.easyButton('fa-home', function (btn, map) {
        if(sidebar.close() === true) {
            offset = document.querySelector('.leaflet-sidebar-content').getBoundingClientRect().width;
            map.fitBounds(map_bounds, {paddingTopLeft: [0, offset]});
        }else{
            map.fitBounds(map_bounds);
        }
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

    // // Create empty layergroup for weather forecast points
    // var weatherGroup = L.layerGroup();
    //
    // // States are in bad shape
    // var weatherbutton = L.easyButton({
    //     states: [{
    //         stateName: 'get-forecast',
    //         icon: 'fa-bolt fa-rotate-15',
    //         title: 'Get forecast',
    //         onClick: function(control) {
    //             // Change to clicked state in case they dont want to do anything
    //             control.state('purgatory-state');
    //             map.on('click', function (e) {
    //                 control.state('loading');
    //                 var popLocation = e.latlng;
    //                 var popup = L.popup()
    //                     .setLatLng(popLocation)
    //                     .setContent(
    //                         "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
    //                         "<div class='row'>" +
    //                         "<div class='col-xs-12' style='padding:0;'>" +
    //                         "<p>Loading...</p>" +
    //                         "</div>" + // col
    //                         "</div>" + // row
    //                         "</div>"
    //                     ).openOn(map);
    //                 var lat = e.latlng.lat.toString();
    //                 var lon = e.latlng.lng.toString();
    //                 $.getJSON('https://api.weather.gov/points/' + lat + ',' + lon, function (data) {
    //                     $.getJSON(data.properties.forecastGridData, function (data) {
    //                         console.log(data);
    //                         var t = moment.utc(data.properties.updateTime).local().fromNow();
    //                         var popLocation = e.latlng;
    //                         var popup = L.popup()
    //                             .setLatLng(popLocation)
    //                             .setContent(
    //                                 "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
    //                                 "<div class='row'>" +
    //                                 "<div class='col-xs-12' style='padding:0;'>" +
    //                                 "<span style='text-align: center;'>NWS forecast for " + e.latlng.lat.toFixed(3).toString() + ", " + e.latlng.lng.toFixed(3).toString() + "</span>" +
    //                                 "</div>" + // col
    //                                 "</div>" + // row
    //                                 "<div class='row'>" +
    //                                 "<div class='col-xs-12' style='padding:0;'>" +
    //                                 "<span class='text-left text-muted'>Last updated " + t  + "</span>" +
    //                                 "</div>" + // col
    //                                 "</div>" + // row
    //                                 "<div class='row'>" +
    //                                 "<div class='col-xs-12' style='padding:0;'>" +
    //                                 "<span class='text-left text-muted'>Forecast elevation: " + (data.properties.elevation.value * 3.28084).toFixed(0) + " ft</span>" +
    //                                 "</div>" + // col
    //                                 "</div>" + // row
    //                                 "</div>" // container
    //                                 ).openOn(map);
    //                         control.state('remove-forecast');
    //                     });
    //                 });
    //             });
    //         }
    //         }, {
    //         icon: 'fa-bolt fa-rotate-15',
    //         stateName: 'remove-forecast',
    //         title: 'Remove forecast',
    //         onClick: function(control) {
    //             map.removeLayer(markerGroup);
    //             control.state('get-forecast');
    //         }
    //         }, {
    //         icon: 'fa-spinner fa-spin',
    //         stateName: 'loading',
    //     },{
    //         icon: 'fa-bolt fa-rotate-15 clicked-color',
    //         stateName: 'purgatory-state',
    //         title: 'Get forecast',
    // }],
    //     position: 'bottomright'
    // }).addTo(map);

});