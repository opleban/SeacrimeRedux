var SoQLQueryMaker = (function(){
  var APP_TOKEN = "jSj3qjGlEI09fjgkmKDHrH4mp";
  var URL_BASE = "https://data.seattle.gov/resource/3k2p-39jp.json?$$app_token=" + APP_TOKEN;
  var WITHIN_A_MILE_OF_CENTURY_LINK = "within_circle(incident_location, 47.595941, -122.331515, 1610)";
  var INCLUDES_DATE_AND_TYPE = "at_scene_time IS NOT NULL AND event_clearance_group IS NOT NULL";

  // There are very few records on crime in 2013, which creates an unusual and mostly likely inaccurate hole in my data if my date range includes 2013. Hence, I set a cut off date so that I am only querying the data after the beginning of 2014. I don't query the database before this date. I also want to avoid having to paginate my responses using the offset if at all possible.

  var CUT_OFF_DATE = "2014-01-01";

  //In order to query a single day, I just query all incidences that occur within a specific 24 hour time, this helper function makes it easy to extract the necessary information from the date string.
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
                        + WITHIN_A_MILE_OF_CENTURY_LINK + " AND "
                        + INCLUDES_DATE_AND_TYPE
                        + " AND (at_scene_time >= '"
                        + timeRange(dateString).start
                        + "' AND at_scene_time <= '"
                        + timeRange(dateString).end + "')";
      var orderStatement = "$order=at_scene_time DESC";
      return [URL_BASE, selectStatement, whereStatement, orderStatement].join("&");
    },

    crimeDataByEventGroup: function(eventGroup){
      var selectStatement = "$select=event_clearance_group, incident_location, at_scene_time, hundred_block_location, event_clearance_description AS description";
      var whereStatement = "$where= "
                        + WITHIN_A_MILE_OF_CENTURY_LINK
                        + " AND event_clearance_group = '" + eventGroup
                        + "' AND at_scene_time >= '"
                        + timeRange(CUT_OFF_DATE).start + "'";
      var orderStatement = "$order=at_scene_time DESC";
      return [URL_BASE, selectStatement, whereStatement, orderStatement,].join("&");
    },

    aggregateCrimeDataByEventGroup: function(eventGroup){
      var selectStatement = "$select=date_trunc_ym(at_scene_time) AS date, count(*) AS total";
      var whereStatement = "$where= "
                        + WITHIN_A_MILE_OF_CENTURY_LINK
                        + " AND event_clearance_group = '" + eventGroup
                        + "' AND at_scene_time >= '"
                        + timeRange(CUT_OFF_DATE).start + "'";
      var orderStatement = "$order=date ASC";
      var groupStatement = "$group=date";
      return [URL_BASE, selectStatement, whereStatement, orderStatement, groupStatement].join("&");
    },

    aggregateCrimeDataByDate:function(dateString){
      var selectStatement = "$select=event_clearance_group, count(*) AS total";
      var whereStatement = "$where=" + WITHIN_A_MILE_OF_CENTURY_LINK + " AND "
                                    + INCLUDES_DATE_AND_TYPE
                                    + " AND (at_scene_time >= '"
                                    + timeRange(dateString).start
                                    + "' AND at_scene_time <= '"
                                    + timeRange(dateString).end + "')";
      var groupStatement = "$group=event_clearance_group";
      return [URL_BASE, selectStatement, whereStatement, groupStatement].join("&");
    },

    aggregateCrimeDataByDateAndEventGroup:function(dateString, eventGroup){
      var selectStatement = "$select=event_clearance_group, incident_location, at_scene_time, hundred_block_location, event_clearance_description AS description";
      var whereStatement = "$where=" + WITHIN_A_MILE_OF_CENTURY_LINK + " AND "
                                    + INCLUDES_DATE_AND_TYPE
                                    + " AND (at_scene_time >= '"
                                    + timeRange(dateString).start
                                    + "' AND at_scene_time <= '"
                                    + timeRange(dateString).end + "')"
                                    + " AND event_clearance_group = '" + eventGroup
      return [URL_BASE, selectStatement, whereStatement].join("&");
    }
  };
}());