var AppView = (function($, _, DataFetcher, MapView, ChartView){
  var $yearSelection = $("select.year-selection");
  var $teamSelection = $("select.team-selection");
  var $displayDate = $('#date');

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

//Pie Chart always displays aggregate data for 2014, only the map re-renders
  function render(date){
    displayDataDate(date);
    if ($('#map').length)
      MapView.renderCrimeData(date);
    if (!($('#pie-chart svg').length))
      ChartView.renderHalfPieChart(date);
  }

  return {
    initialize: function(){
      render();
      listenForYearSelection();
      listenForTeamSelection();
    }
  };
}(jQuery, _, DataFetcher, MapView, ChartView));

AppView.initialize();