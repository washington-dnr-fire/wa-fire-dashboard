(function() {

    // WA COUNTIES
    var counties = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Boundaries/WADNR_PUBLIC_Cadastre_OpenData/MapServer/11",
        style: function (feature) {
            return {
                color: '#000000',
                weight: 2,
            };
        },
    });

    // DNR REGIONS
    var regions = L.esri.featureLayer({
        url: "https://gis.dnr.wa.gov/site3/rest/services/Public_Boundaries/WADNR_PUBLIC_Cadastre_OpenData/MapServer/3",
        style: function (feature) {
            return {
                color: '#000000',
                weight: 2,
            };
        }
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
    });

    daily_fires.bindPopup(function(evt) {
        return L.Util.template(
        "<div class='container rounded-0' style='max-width:375px;margin-top:5px;'>" +
        "<div class='row'>" +
        "<div class='col-xs-12' style='padding:0;'>" +
        "<div class='table-responsive'>" +
        "<div class='table-danger'>" +
        "<thead>" +
        "<tr>" +
        "<th scope='col' colspan='2'>{FIRE_NM}</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td scope='row'>Acres</td>" +
        "<td>{RPTD_ACRES}</td>" +
        "</tr>" +
        "</tbody>" +
        "</div>" + //table
        "</div>" + //responsive table
        "</div>" + // col
        "</div>" + // row
        "</div>", evt.feature.properties
    )});
                                    //
                                    //         <thead>
                                    //         <tr>
                                    //             <th>Location</th>
                                    //             <th class="text-center">DNR Responses</th>
                                    //             <th class="text-center">DNR Fires</th>
                                    //             <th class="text-center">DNR Acres Burned</th>
                                    //             <th class="text-center">All-Lands Acres Burned</th>
                                    //         </tr>
                                    //     </thead>
                                    //     <tbody>
                                    //         <tr>
                                    //             <th scope="row">Westside</th>
                                    //             <td class="text-center">{{ westside_dnr_responses_count|intcomma }}</td>
                                    //             <td class="text-center">{{ westside_dnr_fire_count|intcomma }}</td>
                                    //             <td class="text-center">{{ westside_dnr_fire_acres|intcomma }} ac.</td>
                                    //             <td class="text-center">{{ westside_all_fire_acres|intcomma }} ac.</td>
                                    //
                                    //         </tr>
                                    //         <tr>
                                    //             <th scope="row">Eastside</th>
                                    //             <td class="text-center">{{ eastside_dnr_responses_count|intcomma }}</td>
                                    //             <td class="text-center">{{ eastside_dnr_fire_count|intcomma }}</td>
                                    //             <td class="text-center">{{ eastside_dnr_fire_acres|intcomma }} ac.</td>
                                    //             <td class="text-center">{{ eastside_all_fire_acres|intcomma }} ac.</td>
                                    //         </tr>
                                    //         <tr>
                                    //             <th scope="row">Totals</th>
                                    //             <td class="text-center">{{sum_dnr_response_count|intcomma}}</td>
                                    //             <td class="text-center">{{sum_dnr_fire_count|intcomma}}</td>
                                    //             <td class="text-center">{{sum_dnr_fire_acres|intcomma}} ac.</td>
                                    //             <td class="text-center">{{sum_all_fire_acres|intcomma}} ac.</td>
                                    //         </tr>
                                    //     </tbody>
                                    // </table>
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
        simplifyFactor: 1,
        style: function (feature) {
            return {
                stroke: false,
                fillOpacity: '0.5',
            };
        }
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
        }
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
            }
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
            }
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
        layers: [NWS_warnings, daily_fires, regions]
    });

    L.easyButton('fa-home', function (btn, map) {
        map.setView([home.lat, home.lng], home.zoom);
    }, 'Zoom To Home').addTo(map);


    L.esri.basemapLayer("Topographic").addTo(map);

    var overlays = {
        "Counties": counties,
        "DNR Regions": regions,
        "NWCC Large Fires": daily_fires,
        "NWS Current Warnings": NWS_warnings,
        "NWS 7-Day Rainfall": NWS_QPE,
        "CPC Monthly Drought": CPC_Monthly_Drought,
        "CPC Seasonal Drought": CPC_Seasonal_Drought
    };

    L.control.layers(baseLayers, overlays).addTo(map);
    map.setMaxBounds(map.getBounds());

}(this));
