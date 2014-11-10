requirejs.config({
    baseUrl: './bower_components',
    paths: {
        app: '../js/app',
        jquery: 'jquery/dist/jquery.min',
        amplify: 'amplify/lib/amplify.core.min',
        d3: 'd3/d3.min',
        leaflet: 'leaflet/dist/leaflet',
        "leaflet.markercluster": 'leaflet.markercluster/dist/leaflet.markercluster',
        underscore: 'underscore/underscore-min'
    },
    shim: {
            'leaflet.markercluster': {
                deps: ['leaflet']
            },
            amplify : {
                exports: 'amplify'
            }
        }
});

requirejs(['app/main']);