$(function() {

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
    var blm_lightning_24hr = new L.GeoJSON.AJAX(location.origin + "/egp_data/blm_lightning/1", {
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
        $('#nationalprep').css('backgroundColor', '#F1B34D');
    } else if($('#nat_id').text() > 3){
        $('#nationalprep').css('backgroundColor', '#CA304B');
    }
    if($('#dnr_id').text() == 1){
        $('#dnrprep').css('backgroundColor', '#218c71');
    } else if(2 <= $('#dnr_id').text() && $('#dnr_id').text() <= 3){
        $('#dnrprep').css('backgroundColor', '#F1B34D');
    } else if($('#dnr_id').text() > 3){
        $('#dnrprep').css('backgroundColor', '#CA304B');
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
    if(0 <= $('#type3_id').text() && $('#type3_id').text() <= 2){
        $('#type3teams').css('backgroundColor', '#218c71');
    } else if(2 <= $('#type3_id').text() && $('#type3_id').text() <= 4){
        $('#type3teams').css('backgroundColor', '#F1B34D');
    } else if($('#type3_id').text() >= 4){
        $('#type3teams').css('backgroundColor', '#CA304B');
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
    if(0 <= $('#dnrfires48_id').text() && $('#dnrfires48_id').text() <= 7){
        $('#dnrfires48').css('backgroundColor', '#218c71');
    } else if(8 <= $('#dnrfires48_id').text() && $('#dnrfires48_id').text() <= 18){
        $('#dnrfires48').css('backgroundColor', '#F1B34D');
    } else if($('#dnrfires48_id').text() >= 19 ){
        $('#dnrfires48').css('backgroundColor', '#CA304B');
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
        var alert_id = evt.feature.properties['url']
       
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
        "<a target='_blank' href='" + alert_id + "' rel='noreferrer'>More info</a> " +
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
        "<span>ISSUED BY: DNR " + featureCollection.features[0].properties["Region"] + " REGION &nbsp;&nbsp;<a class='popup-a-link' href='mailto:" + featureCollection.features[0].properties["Email"]+ "'><i class='fas fa-envelope' style='color: #003d6b!important;'></i></a></span><br>" +
        "<span class='text-muted'><small>Visit DNR's <a href='https://burnportal.dnr.wa.gov/' target='_blank' rel='noreferrer'>Burn Portal App</a> for more info!</small></span>" +
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
        "<span>ISSUED BY: DNR " + featureCollection.features[0].properties.DNR_REGION_NAME + " REGION &nbsp;&nbsp;<a class='popup-a-link' href='mailto:" + featureCollection.features[0].properties.REGION_EMAIL_ADDR + "'><i class='fas fa-envelope' style='color: #003d6b!important;'></i></a></span><br>" +
        "<span class='text-muted'><small>Visit DNR's <a href='https://burnportal.dnr.wa.gov/' target='_blank' rel='noreferrer'>Burn Portal App</a> for more info!</small></span>" +
        "</div>" + // col
        "</div>" + // row
        "</div>", featureCollection.features[0].properties 

    )});

    // TEMPORARY - 4th of July Hotspots
    var july4th_hotspots = L.esri.featureLayer({
        url: "https://services.arcgis.com/4x406oNViizbGo13/arcgis/rest/services/july_4th_responses_hotspots/FeatureServer/0",
        pane: "overlays",
        style: function (feature) {
            return {
                fillOpacity: '0.5',
            };
        },
    });

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
    var large_fires = new L.GeoJSON.AJAX(location.origin + "/egp_data/active_incidents/0",{
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
    var large_fires_other = new L.GeoJSON.AJAX(location.origin + "/egp_data/active_incidents/1",{
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
    var emerging_incidents_less24 = new L.GeoJSON.AJAX(location.origin + "/egp_data/active_incidents/2",{
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
            "<span>Emerging fire (< 24 hrs old) at " + lat + ', ' + lng + "</span>" +
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
    var emerging_incidents_greater24 = new L.GeoJSON.AJAX(location.origin + "/egp_data/active_incidents/3",{
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
            "<span>Emerging fire (24 - 48 hrs old) at " + lat + ', ' + lng + "</span>" +
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
    var modis_hotspot_centroids = new L.GeoJSON.AJAX(location.origin + "/egp_data/hotspots/0",{
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
    var viirs_hotspot_centroids = new L.GeoJSON.AJAX(location.origin + "/egp_data/hotspots/2",{
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

    // All da satellites group
    var satellite_detects = L.layerGroup([viirs_hotspot_centroids, modis_hotspot_centroids]);

    // NWS 7-DAY RAINFALL
    var NWS_QPE = L.esri.featureLayer({
        url: 'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/wpc_qpf/MapServer/11',
        simplifyFactor: 1,
        style: function (feature) {
            return {
                stroke: false,
                fillOpacity: '0.22',
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
        "<span class='text-muted'>Valid through " + t + "</span>" +
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
        layers: [counties, NWS_warnings, sit209_fires, wildcad_fires],
        attributionControl: false,
        cursor: false
    });

    // Get initial map bounds for easybutton later
    map_bounds = map.getBounds();

    // Create sidebar instance and add it to the map
    var sidebar = L.control.sidebar({ container: 'sidebar', autopan: true, closeButton: true })
        .addTo(map);

    // Add a basemap to map
    baseLayers.Terrain.addTo(map);

    // Create panes to handle z-index stuff and be tidy
    map.createPane('boundaries');
    map.createPane('overlays');
    map.createPane('points');
    map.createPane('lightningclusters');


    // Create groupings of overlays for layer pick list
    var baseTree = {
        label: 'Basemaps',
        children: [
            {
                label: 'Terrain', layer: baseLayers.Terrain
            },
            {
                label: 'Topographic', layer: baseLayers.Topographic 
            },
            {
                label: 'Imagery', layer: baseLayers.Imagery
   
            },
        ]
    };
    var overlaysTree = {
        label: 'Overlays',
        noShow: true,
        children: [ 
            {
                label: 'Boundaries',
                children:  [
                    {
                        label: 'Counties', layer: counties
                    },
                    {
                        label: 'DNR Regions', layer: regions
                    },
                ],
                collapsed: true
            },
            {
                label: 'Fires',
                children:  [
                {
                    label: 'NWCC Large Fires', layer: daily_fires
                },
                {
                    label: 'SIT-209 Fires', layer: sit209_fires
                },
                {
                    label: 'WildCAD Fires', layer: wildcad_fires
                },
                {
                    label: 'Satellite Hotspots', layer: satellite_detects
                },
                ],
                collapsed: true
            },
            {
                label: 'Fire Risk',
                children:  [
                    {
                        label: 'DNR Fire Danger', layer: firedanger
                    },
                    {
                        label: 'IFPLs', layer: ifpl
                    },
                    {
                        label: '4th of July Hotspots', layer: july4th_hotspots
                    },
                ],
                collapsed: true
            },
            {
                label: 'Weather',
                children:  [
                    {
                        label: 'NWS Current Warnings', layer: NWS_warnings
                    },
                    {
                        label: '24-Hour Lightning Strikes', layer: lightning
                    },
                    {
                        label: 'NWS 7-Day Rain Forecast', layer: NWS_QPE
                    },
                ],
                collapsed: true
            },

            
        ]
    };


    // Add layer group control to map
    var layerControl = L.control.layers.tree(baseTree, overlaysTree).addTo(map);

    L.DomEvent.disableClickPropagation(layerControl._container);
    L.DomEvent.disableScrollPropagation(layerControl._container);

    // Add some pretty to layer control
    $( ".leaflet-control-layers-base" ).before( "<div class='close-button text-secondary'>Close Layer Control <i class='fas fa-times'></i></div>" );
    $( ".close-button" ).mouseover(function() {
        $(this).addClass('text-danger');
        $(this).css('cursor', 'pointer');
    });
    $( ".close-button" ).mouseout(function() {
        $(this).removeClass('text-danger');
        $(this).addClass('text-secondary');
        $(this).css('cursor', 'none');
    });

    $( ".close-button" ).click(function() {
        $(".leaflet-control-layers").removeClass("leaflet-control-layers-expanded")

    });

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


    var defaultStart = new Date().getFullYear() + '-01-01'

    function createFreqArray (anyArray) {
        var freqMap = {};

        anyArray.forEach(function (key) {
          if (freqMap.hasOwnProperty(key)) {
            freqMap[key]++;
          } else {
            freqMap[key] = 1;
          }
        });
      
        return freqMap;
      
      }
    $.getJSON({ 
        type: "GET",
        async:true,
        url: 'https://gis.dnr.wa.gov/site3/rest/services/Public_Wildfire/WADNR_PUBLIC_WD_WildFire_Data/MapServer/2/query?where=START_DT+%3E+DATE+%27' + defaultStart + '%27&FIREEVNT_CLASS_LABEL_NM%3D%27Classified%27&PROTECTION_TYPE<>%27DNR+Assist+Other+Agency%27&outSR=4326&outFields=*&returnGeometry=false&f=pjson', 
        success: function(results) { 
            var fires = []
            var ac_dict = {}
            for (i in results.features){
                if ((results.features[i].attributes.PROTECTION_TYPE != 'DNR Assist Other Agency' && results.features[i].attributes.FIREEVNT_CLASS_LABEL_NM =='Classified')){
                    month = moment(results.features[i].attributes.START_DT).format('MMMM')
                    prot_type = results.features[i].attributes.PROTECTION_TYPE
                    acres = results.features[i].attributes.ACRES_BURNED
                    county = results.features[i].attributes.COUNTY_LABEL_NM
                    cause = results.features[i].attributes.FIREGCAUSE_LABEL_NM
                    date_delta = moment().diff(moment(results.features[i].attributes.START_DT), 'days')
                    fires.push([month, prot_type, acres, county, cause, date_delta])
                    if(!ac_dict[month]){
                        ac_dict[month]=[];
                    }
                    ac_dict[month].push(acres);
                }
            }
            for (i in ac_dict){
                ac_dict[i] = ac_dict[i].reduce(function(acc, val) { return acc + val; }, 0).toFixed(2)

            }
    
            months = []
            causes = []
            counties = []
            for (i in fires){
                months.push(fires[i][0])
                causes.push(fires[i][4])
            }
    
            mo = createFreqArray(months)
            causes = createFreqArray(causes)

            data = {
                datasets: [{
                    backgroundColor:["#a6cee3", "#1f78b4","#b2df8a","#33a02c","#e31a1c", "#fb9a99", "#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"],
                    data: Object.values(causes),
                }],
                labels: Object.keys(causes)
            };
            var ctx = $('#chart1');
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    legend: {
                        display: false
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 20,
                            bottom:20
                        }
                    },
                    responsive: true,

                    plugins: {
                        datalabels: { 
                            display: function(context) {
                                return context.dataset.data[context.dataIndex] >= 15; // or >= 1 or ...
                             },
                            color: '#000000',
                            font:{
                                size: 10
                            },
                            anchor: 'end',
                            align:'end',
                            // display: 'auto',
                            formatter: function(value, context) {
                                return context.chart.data.labels[context.dataIndex] + ' (' + value + ')';
                            }
                    }}}
            });

            data2 = {
                datasets: [{
                    data: Object.values(mo),
                    backgroundColor: "rgba(0,61,107,1)"
                }],
                labels: Object.keys(mo)
            };

            var cty = document.getElementById('chart2').getContext('2d');
            var chart2 = new Chart(cty, {
                type: 'bar',
                data: data2,
                options: {
                    legend: {
                        display: false
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 20,
                            bottom:20
                        }
                    },
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: '#000000'
                            },

                            gridLines: {
                                drawOnChartArea: false,
                                tickMarkLength: 5,	
                                color: '#000000',
                                zeroLineColor: '#000000'	

                            }   
                        }],
                        xAxes: [{
                            offset: true,
                            ticks: {
                                fontColor: '#000000'
                            },
                            gridLines: {
                                drawOnChartArea: false,
                                tickMarkLength: 5,	
                                color: '#000000'

                            },
                            // barPercentage: 1,
                            categoryPercentage: 1,
                            type: 'time',
                            time: {
                                parser: 'MMMM',
                                unit: 'month',
                                displayFormats: {
                                    'month': 'MMM',
                                }
                            },
                        }]                    
                    },

                    plugins: {
                        datalabels: { 
                            color: '#000000',
                            font:{
                                size: 10
                            },
                            anchor: 'end',
                            align:'end',
                            offset:-5
                            // // display: 'auto',
                            // formatter: function(value, context) {
                            //     return context.chart.data.labels[context.dataIndex] + ' (' + value + ')';
                            // }
                    }}

                }
            });
    
            data3 = {
                datasets: [{
                    data: Object.values(ac_dict),
                    backgroundColor: "rgba(227,26,28,1)"
                }],
                labels: Object.keys(ac_dict)
            };

            var ctz = document.getElementById('chart3').getContext('2d');
            var chart2 = new Chart(ctz, {
                type: 'bar',
                data: data3,
                options: {
                    legend: {
                        display: false
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 20,
                            bottom:20
                        }
                    },
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: '#000000'
                            },
                            gridLines: {
                                drawOnChartArea: false,
                                tickMarkLength: 5,	
                                color: '#000000',
                                zeroLineColor: '#000000'	

                            }   
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: '#000000'
                            },
                            offset: true,

                            gridLines: {
                                drawOnChartArea: false,
                                tickMarkLength: 5,	
                                color: '#000000',

                            },
                            // barPercentage: 1,
                            categoryPercentage: 1,
                            type: 'time',
                            time: {
                                parser: 'MMMM',
                                unit: 'month',
                                displayFormats: {
                                    'month': 'MMM',
                                }
                            },
                        }]                    
                    },

                    plugins: {
                        datalabels: { 
                            color: '#000000',
                            font:{
                                size: 10
                            },
                            anchor: 'end',
                            align:'end',
                            offset:-5

                            // // display: 'auto',
                            // formatter: function(value, context) {
                            //     return context.chart.data.labels[context.dataIndex] + ' (' + value + ')';
                            // }
                    }}

                }
            });
        }
    });

   
});