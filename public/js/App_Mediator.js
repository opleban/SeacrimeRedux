var AppMediator = (function($, _, amplify, DataFetcher, MapView, PieChart, BarChart){
  var $yearSelection = $("select.year-selection");
  var $teamSelection = $("select.team-selection");
  var $displayDate = $('#date');
  var currentCrimeDate= "2014";

  function publicInit(){
    var barChart = new BarChart.Chart({
        margin: {top: 20, right: 20, bottom: 10, left: 20},
        width: 400,
        height: 400,
        el: '#bar-chart'
    });

    displayDataDate();
    DataFetcher.getCrimeData({}, function(data){
      MapView.renderCrimeData(data);
    });
    PieChart.init();
    listenForYearSelection();
    listenForTeamSelection();
    amplify.subscribe("pieClick", function(d){
      var options = {eventGroup: d.data.event_clearance_group, date: currentCrimeDate};
      DataFetcher.getAggMonthlyDataByGroup(options.eventGroup, function(data, group){
          barChart.drawMonthly(data, group);
      });
      DataFetcher.getCrimeData(options, function(data){
        debugger;
        MapView.renderCrimeData(data);
      });
    });
  }

  function render(date){
    displayDataDate(date);
    DataFetcher.getCrimeData({}, function(data){
      MapView.renderCrimeData(data);
    });
    PieChart.render(date);
  }

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
        render($currentSelection.attr("x-game-date"));
    });
  }

  return {
    init: publicInit
  };
}(jQuery, _, amplify, DataFetcher, MapView, PieChart, BarChart));

AppMediator.init();