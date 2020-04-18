mapboxgl.accessToken = 'pk.eyJ1Ijoia2FybHRhYWwiLCJhIjoiY2s5Mzhqd2FlMDJndDNwcW54eWRtMjRmZCJ9.NPpf4n7Du1k977GiJDafEw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [24.7, 59.43], // starting position
    zoom: 9, // starting zoom
    type: "Point"
});

map.doubleClickZoom.disable();

/* given a query in the form "lng, lat" or "lat, lng" returns the matching
* geographic coordinate(s) as search results in carmen geojson format,
* https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
*/
var coordinatesGeocoder = function (query) {
// match anything which looks like a decimal degrees coordinate pair
    var matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
        return null;
    }

    function coordinateFeature(lng, lat) {
        return {
            center: [lng, lat],
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            place_name: 'Lat: ' + lat + ' Lng: ' + lng,
            place_type: ['coordinate'],
            properties: {},
            type: 'Feature'
        };
    }

    var coord1 = Number(matches[1]);
    var coord2 = Number(matches[2]);
    var geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
// must be lng, lat
        geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
// must be lat, lng
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
// else could be either lng, lat or lat, lng
        //geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    return geocodes;
};

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 7,
        placeholder: 'Try: -40(lat), 170(long)',
        marker: false,
        mapboxgl: mapboxgl
    })
);


$("#calcrun").click(function () {
    if ($("#inserted_long").val() !== "" && $("#inserted_lat").val() !== "") {

        var codes = [$("#inserted_long").val(), $("#inserted_lat").val()];
        map.flyTo({center: codes, zoom: 9})
    }
})
;


// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

map.on("moveend", function (e) {
    $("#inserted_lat").val(map.getCenter().toArray()[1]);
    $("#inserted_long").val(map.getCenter().toArray()[0]);
});


map.on('click', function (e) {
    var codes = [e.lngLat.toArray()[0], e.lngLat.toArray()[1]];
    map.flyTo({center: codes, zoom: 9})
});