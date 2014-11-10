var DataFetcher = (function($, SoQLQueryMaker){

  TEAM_NAMES = {DAL:"Dallas Cowboys", SF:"San Francisco 49ers", JAC:"Jacksonville Jaguars", TEN: "Tennessee Titans", GB:"Green Bay Packers", TB:"Tampa Bay Buccaneers", MIN:"Minnesota Vikings", NO:"New Orleans Saints", ARI: "Arizona Cardinals", STL:"St. Louis Rams", NE: "New England Patriots", NYJ:"New York Jets", DEN:"Denver Broncos", OAK: "Oakland Raiders", NYG: "New York Giants", STL: "St. Louis Rams"};

  function getMonthName(monthNumber){
    var MONTH_NAME = {0:'Jan',  1:'Feb' , 2:'Mar' , 3:'Apr', 4:'May', 5:'Jun' , 6:'Jul', 7:'Aug', 8:'Sept', 9:'Oct', 10:'Nov', 11:'Dec'};
    return MONTH_NAME[monthNumber];
  }

  return {
    getOpposingTeamNamesAndDates: function(year, callbackFn){
      var jsonPath = "js/seahawk_schedule/NFL" + year +".json";
      $.getJSON(jsonPath, function(data, status){
        var teamsAndDates = data.map(function(game){
          return {
                    teamName: TEAM_NAMES[game.away],
                    gameDate: game.scheduled
                  };
        });
        if (callbackFn){
          callbackFn(teamsAndDates);
        } else { console.log("No callback provided"); }
      })
      .fail(function(e){
        console.log("ERROR!");
      });
    },

    getCrimeData: function(options, callbackFn){
      var query = SoQLQueryMaker.crimeData(options);
      $.getJSON(query, function(data, status){
        if (callbackFn){
          callbackFn(data);
        } else { console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getAggregateCrimeData: function(options, callbackFn){
      var query = SoQLQueryMaker.aggregateCrimeData(options);
      $.getJSON(query, function(data, status){
        if (callbackFn){
          var totalCrimeFigure = 0;
          data.forEach(function(crime){
            crime.total = +crime.total;
            totalCrimeFigure += crime.total;
          });
          callbackFn(data, totalCrimeFigure);
        } else { console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getAggMonthlyDataByGroup: function(eventGroup, callbackFn){
      var query = SoQLQueryMaker.aggregateMonthlyCrimeDataByEventGroup(eventGroup);
      $.getJSON(query, function(data, status){
        data.forEach(function(d) {
          d.date = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(d.date);
          d.month = getMonthName(d.date.getMonth());
          d.total = +d.total;
        });
        if (callbackFn){
          callbackFn(data, eventGroup);
        } else{ console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },
  };
}(jQuery, SoQLQueryMaker));