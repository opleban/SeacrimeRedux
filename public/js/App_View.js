var AppMediator = (function($, _, amplify, DataFetcher, MapView, PieChart, BarChart){
  var $yearSelection = $("select.year-selection");
  var $teamSelection = $("select.team-selection");
  var $displayDate = $('#date');

  function publicInit(){
    displayDataDate();
    MapView.renderCrimeData();
    PieChart.init();
    listenForYearSelection();
    listenForTeamSelection();
    amplify.subscribe("pieClick", function(d){
      BarChart.draw(d.data.event_clearance_group);
      MapView.renderCrimeDataByEventGroup(d.data.event_clearance_group);
    });
  }

  //Pie Chart always displays aggregate data for 2014, only the map re-renders
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
      var dateToDisplay = formatGameDate(date);
    } else {
      var dateToDisplay = "2014";
    }
    $displayDate.empty();
    $displayDate.html(dateToDisplay);
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