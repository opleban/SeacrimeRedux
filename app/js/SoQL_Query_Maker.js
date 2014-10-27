var SoQLQueryMaker = (function(){
  var APP_TOKEN = "jSj3qjGlEI09fjgkmKDHrH4mp";
  var URL_BASE = "https://data.seattle.gov/resource/3k2p-39jp.json?$$app_token=" + APP_TOKEN;
  var WITHIN_A_MILE_OF_CENTURY_LINK = "within_circle(incident_location, 47.595941, -122.331515, 1610)";
  var INCLUDES_DATE_AND_TYPE = "at_scene_time IS NOT NULL AND event_clearance_group IS NOT NULL";
  var CUT_OFF_DATE = "2014-01-01";

  function timeRange(dateString){
    var baseString = dateString.slice(0,10);
    return {
      start: baseString + 'T00:00:00',
      end: baseString + 'T23:59:59'
    };
  };

  return {
    allCrimeData: function(){
      var selectStatement = "$select=event_clearance_group, incident_location, at_scene_time, hundred_block_location, event_clearance_description AS description";
      var whereStatement = "$where="
                          + INCLUDES_DATE_AND_TYPE + " AND "
                          + WITHIN_A_MILE_OF_CENTURY_LINK ;
      var orderStatement = "$order=at_scene_time DESC";
      return [URL_BASE, selectStatement, whereStatement, orderStatement].join("&");
    },

    aggregateCrimeData:function(){
      var selectStatement = "$select=event_clearance_group, count(*) AS total";
      var whereStatement = "$where=" + WITHIN_A_MILE_OF_CENTURY_LINK + " AND "
        + INCLUDES_DATE_AND_TYPE + " AND "
        + "(at_scene_time >= '"
        + timeRange(CUT_OFF_DATE).start + "')";
      var groupStatement = "$group=event_clearance_group";
      return [URL_BASE, selectStatement, whereStatement, groupStatement].join("&");
    },

    dataByDate:function(dateString){
      var selectStatement = "$select=event_clearance_group, incident_location, at_scene_time, event_clearance_description AS description, hundred_block_location";
      var whereStatement = "$where="
                        + WITHIN_A_MILE_OF_CENTURY_LINK
                        + " AND (at_scene_time >= '"
                        + timeRange(dateString).start
                        + "' AND at_scene_time <= '"
                        + timeRange(dateString).end + "')";
      var orderStatement = "$order=at_scene_time DESC";
      return [URL_BASE, selectStatement, whereStatement, orderStatement].join("&");
    },

    crimeDataByEventGroup: function(eventGroup){
      var selectStatement = "$select=date_trunc_ym(at_scene_time) AS date, count(*) AS total";
      var whereStatement = "$where= "
                        + WITHIN_A_MILE_OF_CENTURY_LINK
                        + " AND event_clearance_group = '" + eventGroup
                        + "' AND at_scene_time >= '"
                        + timeRange(CUT_OFF_DATE).start + "'";
      var orderStatement = "$order=date ASC";
      var groupStatement = "$group=date";
      return [URL_BASE, selectStatement, whereStatement, orderStatement, groupStatement].join("&");
    }
  };
}());