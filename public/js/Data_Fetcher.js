var DataFetcher = (function($, SoQLQueryMaker){

  TEAM_NAMES = {DAL:"Dallas Cowboys", SF:"San Francisco 49ers", JAC:"Jacksonville Jaguars", TEN: "Tennessee Titans", GB:"Green Bay Packers", TB:"Tampa Bay Buccaneers", MIN:"Minnesota Vikings", NO:"New Orleans Saints", ARI: "Arizona Cardinals", STL:"St. Louis Rams", NE: "New England Patriots", NYJ:"New York Jets", DEN:"Denver Broncos", OAK: "Oakland Raiders", NYG: "New York Giants", STL: "St. Louis Rams"};

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
          callbackFn(data);
        } else { console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getAggregateMonthlyCrimeDataByEventGroup: function(eventGroup, callbackFn){
      var query = SoQLQueryMaker.aggregateMonthlyCrimeDataByEventGroup(eventGroup);
      $.getJSON(query, function(data, status){
        if (callbackFn){
          callbackFn(data);
        } else{ console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },
  };
}(jQuery, SoQLQueryMaker));