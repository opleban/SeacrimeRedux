define(['jquery', 'underscore', 'amplify', 'app/DataFetcher', 'app/MapView', 'app/PieChart', 'app/BarChart'], function($, _, amplify, DataFetcher, MapView, PieChart, BarChart){
  var $yearSelection = $("select.year-selection");
  var $teamSelection = $("select.team-selection");
  var $displayDate = $('#date');
  var currentCrimeDate= "2014";
  var crimeMap, pieChart, barChart;

  function formatGameDate(date){
    return date.slice(0,10);
  }

  function displayDataDate(date){
    if (date) {
      currentCrimeDate = formatGameDate(date);
    } else {
      currentCrimeDate = "2014";
    }
    $displayDate.empty();
    $displayDate.html(currentCrimeDate);
  }

  function listenForYearSelection(){
    $yearSelection.change(function(){
      DataFetcher.getOpposingTeamNamesAndDates(this.value, function(data){
        var teamOptionsTemplate = _.template($("#select-template").html())({data:data});
        $teamSelection.empty();
        $teamSelection.append(teamOptionsTemplate);
      });
    });
  }

  function listenForTeamSelection(){
    $teamSelection.change(function(){
      var $currentSelection = $("select.team-selection option:selected");
      if ($currentSelection)
        amplify.publish('teamSelect', {date: $currentSelection.attr('x-game-date')});
    });
  }

  function publicInit(){
    barChart = new BarChart.Chart({
      margin: {top: 20, right: 20, bottom: 10, left: 20},
      width: 400,
      height: 400,
      el: '#bar-chart'
    });

    crimeMap = new MapView.Map();

    pieChart = new PieChart.Chart({
      width: 600,
      height: 350,
      el: '#pie-chart'
    });

    DataFetcher.getCrimeData({}, function(data){
      crimeMap.renderCrimeData(data);
    });

    DataFetcher.getAggregateCrimeData({}, function(data, totalCrimeFigure){
      pieChart.draw(data, totalCrimeFigure);
    });

    listenForYearSelection();
    listenForTeamSelection();

    amplify.subscribe('pieClick', function(d){
      var options = {eventGroup: d.data.event_clearance_group, date: currentCrimeDate};
      //fetches aggregate monthly crime data by eventGroup, then renders the bar chart
      DataFetcher.getAggMonthlyDataByGroup(options.eventGroup, function(data, group){
        barChart.drawMonthly(data, group);
      });
      // fetches crime data by eventGroup and renders it on the map
      DataFetcher.getCrimeData(options, function(data){
        crimeMap.renderCrimeData(data);
      });
    });

    // listens for team selection
    amplify.subscribe('teamSelect', function(d){
      displayDataDate(d.date);
      // fetches crime data for the game date and renders it on the map
      DataFetcher.getCrimeData({date:d.date}, function(data){
        crimeMap.renderCrimeData(data);
      });
      // fetches aggregate crime data and updates the pie chart
      DataFetcher.getAggregateCrimeData({date:d.date}, function(data, totalCrimeFigure){
        pieChart.update(data, totalCrimeFigure, d.date);
      });
    });
  }

  return {
    init: publicInit
  };
});