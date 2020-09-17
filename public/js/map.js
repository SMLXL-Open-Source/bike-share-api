mapboxgl.accessToken =
    'pk.eyJ1Ijoia2hhYnVidW5kaXZodSIsImEiOiJjazdsamZkODUwNGFkM25wYTIxbWZqa2hiIn0.nJ0ete1ZhmWgyL_T6dkiAw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    zoom: 6,
    center: [22.937506, -30.559483]
});
map.addControl(new mapboxgl.NavigationControl());

// Fetch stores from API
async function getStations() {
    const res = await fetch('/api/v1/stations');
    const data = await res.json();
    console.log(data);

    const stations = data.stations.map(station => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    station.location.coordinates[0],
                    station.location.coordinates[1]
                ]
            },
            properties: {
                icon: 'bicycle'
            }
        };
    });

    loadMap(stations);
}

// Load map with stores
function loadMap(stations) {
    map.on('load', function() {
        map.addLayer({
            id: 'points',
            type: 'symbol',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: stations
                }
            },
            layout: {
                'icon-image': '{icon}-15',
                'icon-size': 1.5,
                'text-field': '{storeId}',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.9],
                'text-anchor': 'top'
            }
        });
    });
}

getStations();