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

    getCrimeDataByDay: function(gameDate, callbackFn){
      var query = SoQLQueryMaker.dataByDate(gameDate);
      $.getJSON(query, function(data, status){
        if (callbackFn){
          callbackFn(data);
        } else { console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getAllCrimeData: function(callbackFn){
      var query = SoQLQueryMaker.allCrimeData();
      $.getJSON(query, function(data, status){
        if (callbackFn){
          callbackFn(data);
        } else { console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getCrimeDataByEventGroup: function(eventGroup, callbackFn){
      var query = SoQLQueryMaker.crimeDataByEventGroup(eventGroup);
      $.getJSON(query, function(data, status){
        if (callbackFn){
          callbackFn(data);
        } else{ console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getAggregateCrimeData: function(callbackFn){
      var query = SoQLQueryMaker.aggregateCrimeData();
      $.getJSON(query, function(data, status){
        if (callbackFn){
          callbackFn(data);
        } else { console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getAggregateCrimeDataByEventGroup: function(eventGroup, callbackFn){
      var query = SoQLQueryMaker.aggregateCrimeDataByEventGroup(eventGroup);
      $.getJSON(query, function(data, status){
        if (callbackFn){
          callbackFn(data);
        } else{ console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getAggregateCrimeDataByDate: function(dateString, callbackFn){
      var query = SoQLQueryMaker.aggregateCrimeDataByDate(dateString);
      $.getJSON(query, function(data, status){
        if (callbackFn){
          callbackFn(data);
        } else{ console.log("No callback provided"); }
      })
        .fail(function(e){
          console.log("Error fetching data!");
        });
    },

    getAggregateCrimeDataByDateAndEventGroup: function(dateString, eventGroup, callbackFn){
      var query = SoQLQueryMaker.aggregateCrimeDataByDateAndEventGroup(dateString, eventGroup);
      $.getJSON(query, function(data, status){
        if (callbackFn){
            callbackFn(data);
        } else{ console.log("No callback provided"); }
        .fail(function(e){ console.log("Error fetching data!"); });
      });
    };
}(jQuery, SoQLQueryMaker));