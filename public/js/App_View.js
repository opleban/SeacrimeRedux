var AppView = (function($, _, DataFetcher, MapView, ChartView){
  var $yearSelection = $("select.year-selection");
  var $teamSelection = $("select.team-selection");

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

  function render(date){
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