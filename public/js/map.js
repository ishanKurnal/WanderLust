
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', // You can change this to your preferred map style
    center: listing.geometry.coordinates,
    zoom: 9
});

map.on('load', () => {
    // Load an image from an external URL.
    map.loadImage(
        'https://png.pngtree.com/png-vector/20230506/ourmid/pngtree-location-pin-home-in-red-gray-color-for-map-vector-png-image_7082117.png', // <-- IMPORTANT: Change this URL to your own icon
        (error, image) => {
            if (error) throw error;

            // Add the image to the map style.
            map.addImage('custom-marker', image);

            // Add a data source containing one point feature.
            map.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': listing.geometry.coordinates
                            },
                            'properties': {
                                'title': listing.title
                            }
                        }
                    ]
                }
            });

            // Add a layer to use the image to represent the data.
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point', // reference the data source
                'layout': {
                    'icon-image': 'custom-marker', // reference the image
                    'icon-size': 0.18,
                    'icon-allow-overlap': true
                }
            });
        }
    );
});

// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

map.on('mouseenter', 'points', (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    const coordinates = e.features[0].geometry.coordinates.slice();
    const title = e.features[0].properties.title;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(`<h4>${title}</h4><p>Exact Location will be provided after booking</p>`).addTo(map);
});

map.on('mouseleave', 'points', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
});
