angular.module('modelCompanyApp').
directive('map', ['$window', 'ObjectService',
    function($window, ObjectService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                mess: "@"
            },
            link: function(scope, element, attrs) {
                var map, heat, markers, heatmapShowing = true,
                    markersShowing = true;

                // Watch for model data changes
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        draw(newVal);
                });
                
                // Create the map
                var mapId = scope.mess? 'map'+scope.mess : 'map';

                map = L.map(mapId, {
                    minZoom: 5,
                    maxZoom: 12,
                    zoomControl: false
                }).setView([40.398036,-76.811517], 6);

                L.esri.basemapLayer('Gray').addTo(map);
                L.esri.basemapLayer('GrayLabels').addTo(map);

                // Draw the map
                function draw(data) {

                    if (scope.mess)
                        data = _.reject(data, function(d) {
                            return d.mess !== scope.mess;
                        })

                    var latLngs = [];
                    
                    _.each(data, function(d) {
                        if (d.latitude && d.longitude) {
                            // Create the array of lat lngs for the heatlayer
                            latLngs.push([parseFloat(d.latitude), parseFloat(d.longitude)]);
                        }
                    });

                    // Create the heatmap
                    heat = L.heatLayer(latLngs, {
                        radius: 16,
                        minOpacity: 0.3,
                        gradient: {
                            0.4: '#4393c3',
                            0.65: '#f4a582',
                            1: '#b2182b'
                        }
                    });

                    map.addLayer(heat);
                    map.fitBounds(latLngs);

                }
            }
        }
    }
])