// Make it more OO, turn it into a constructor function
// use require JS
// have top-level module called main js, and the main js would make reference to all of my module
// Jasmine tests, tests the constructor function and its property, any methods
// check that the dom elements are the right side and color
// check that the colors are right
var MapView = (function($, _, L, DataFetcher){
  var MAPBOX_URL = "http://{s}.tiles.mapbox.com/v3/opleban.j9f7bfle/{z}/{x}/{y}.png";
  var CENTURYLINK_COORDINATES = [47.595372, -122.331363];

  var Map = function(){
    this.map = L.map("map", {center:CENTURYLINK_COORDINATES, zoom:14, scrollWheelZoom:false})
                .addLayer(new L.TileLayer(MAPBOX_URL));
    this.markers = L.markerClusterGroup();
  };

  Map.prototype.renderCrimeData = function(data){
    var that = this;
    that.markers.clearLayers();
    data.forEach(function(crime){
      var marker = new L.marker(
        [crime.incident_location.latitude,
        crime.incident_location.longitude])
      .bindPopup("<p>Location: "
        + crime.hundred_block_location
        + "<br/> Type: "
        + crime.event_clearance_group
        + "<br/> Description: "
        + crime.description
        + "<br/> Date: "
        + crime.at_scene_time
        + "</p>");
      that.markers.addLayer(marker);
    });
    that.map.addLayer(that.markers);
  }

  return {
      Map: Map
  };

}(jQuery, _, L, DataFetcher));