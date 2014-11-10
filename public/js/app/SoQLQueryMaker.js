define(function(){
  var APP_TOKEN = "jSj3qjGlEI09fjgkmKDHrH4mp";
  var URL_BASE = "https://data.seattle.gov/resource/3k2p-39jp.json?$$app_token=" + APP_TOKEN;
  var WITHIN_A_MILE_OF_CENTURY_LINK = "within_circle(incident_location, 47.595941, -122.331515, 1610)";
  var INCLUDES_DATE_AND_TYPE = "at_scene_time IS NOT NULL AND event_clearance_group IS NOT NULL";

  // There are very few crime records for2013, which creates an unusual and mostly likely inaccurate hole in the data between 2012 and 2014. Hence, I set a cut off date so that I am only querying the data after the beginning of 2014. I don't query the database before this date. I also want to avoid having to make multiple queries or paginate my responses using the offset if at all possible when querying crime data for the map, where they may be more than 2000 results.

  var CUT_OFF_DATE = "2014-01-01";
  var DEFAULT_YEAR = "2014";

  //In order to query a single day, I just query all incidences that occur within a specific 24 hour time, this helper function makes it easy to extract the necessary information from the date string.
  function timeRange(dateString){
    var baseString = dateString.slice(0,10);
    return {
      start: baseString + 'T00:00:00',
      end: baseString + 'T23:59:59'
    };
  }

  function makeDateWhereStatement(dateString){
    return "(at_scene_time >= '"
          + timeRange(dateString).start
          + "' AND at_scene_time <= '"
          + timeRange(dateString).end + "')";
  }

  function makeEventGroupWhereStatement(eventGroup){
    return "event_clearance_group = '" + eventGroup + "'";
  }

  return {
    // builds query to fetch an array of individual crime datapoints
    crimeData: function(options){
      var selectStatement = "$select=event_clearance_group, incident_location, at_scene_time, hundred_block_location, event_clearance_description AS description";
      var whereStatement = "$where="
                          + INCLUDES_DATE_AND_TYPE + " AND "
                          + WITHIN_A_MILE_OF_CENTURY_LINK ;
      var orderStatement = "$order=at_scene_time DESC";
      var where = [];
      if (!options){
        return [URL_BASE, selectStatement, whereStatement, orderStatement].join("&");
      }
      if (options.date !== DEFAULT_YEAR && options.date){
        where.push(makeDateWhereStatement(options.date));
      } else {
        where.push("(at_scene_time >= '" + timeRange(CUT_OFF_DATE).start + "')");
      }
      if (options.eventGroup){
        where.push(makeEventGroupWhereStatement(options.eventGroup));
      }
      whereStatement += " AND " + where.join(" AND ");
      return [URL_BASE, selectStatement, whereStatement, orderStatement].join("&");
    },
    //builds query to fetch aggregated (count) crime data grouped by event_clearance_group
    aggregateCrimeData: function(options){
      var selectStatement = "$select=event_clearance_group, count(*) AS total";
      var whereStatement = "$where=" + WITHIN_A_MILE_OF_CENTURY_LINK
                            + " AND " + INCLUDES_DATE_AND_TYPE;
      var groupStatement = "$group=event_clearance_group";
      var where = [];
      if (!options){
        return [URL_BASE, selectStatement, whereStatement, groupStatement].join("&");
      }
      if (options.date){
        where.push(makeDateWhereStatement(options.date));
      } else {
        where.push("(at_scene_time >= '" + timeRange(CUT_OFF_DATE).start + "')");
      }
      if (options.eventGroup){
        where.push(makeEventGroupWhereStatement(options.eventGroup));
      }
      whereStatement += " AND " + where.join(" AND ");
      return [URL_BASE, selectStatement, whereStatement, groupStatement].join("&");
    },
    // builds a query that fetches aggregate crime date grouped by month
    aggregateMonthlyCrimeDataByEventGroup: function(eventGroup){
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
});