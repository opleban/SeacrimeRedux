var AppMediator = (function($, _, amplify, DataFetcher, MapView, PieChart, BarChart){
  var $yearSelection = $("select.year-selection");
  var $teamSelection = $("select.team-selection");
  var $displayDate = $('#date');
  var currentCrimeDate= "2014";

  function publicInit(){
    displayDataDate();
    MapView.renderCrimeData();
    PieChart.init();
    listenForYearSelection();
    listenForTeamSelection();
    amplify.subscribe("pieClick", function(d){
      BarChart.draw(d.data.event_clearance_group);
      MapView.renderCrimeDataByEventGroup(d.data.event_clearance_group, currentCrimeDate);
    });
  }

  function render(date){
    displayDataDate(date);
    MapView.renderCrimeData(date);
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