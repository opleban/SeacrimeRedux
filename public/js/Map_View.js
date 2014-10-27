var MapView = (function($, _, L, DataFetcher){
  var MAPBOX_URL = "http://{s}.tiles.mapbox.com/v3/opleban.j9f7bfle/{z}/{x}/{y}.png";
  var CENTURYLINK_COORDINATES = [47.595372, -122.331363];
  var map = map || createMap();
  var markers = L.markerClusterGroup();

  function createMap(){
    if ($('#map').length)
      return L.map("map", {center:CENTURYLINK_COORDINATES, zoom:14, scrollWheelZoom:false})
                  .addLayer(new L.TileLayer(MAPBOX_URL));
  }

  function renderCrimeDataOnMap(data){
    markers.clearLayers();
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
      markers.addLayer(marker);
    });
    map.addLayer(markers);
  }

  return {
    renderCrimeDataByEventGroup: function(eventGroup){
      DataFetcher.getCrimeDataByEventGroup(eventGroup, renderCrimeDataOnMap);
    },

    renderCrimeData: function(date){
      // if no date is provided, then map will display most recent crime data. If a date is provided, then map will display only crime data from that date.
      if (date){
        DataFetcher.getCrimeDataByDay(date, renderCrimeDataOnMap);
      } else {
        DataFetcher.getAllCrimeData(renderCrimeDataOnMap);
      }
    },
  };

}(jQuery, _, L, DataFetcher));