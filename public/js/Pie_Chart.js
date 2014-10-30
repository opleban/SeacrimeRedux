var PieChart = (function(d3, DataFetcher){
  var width, height, radius, pie, color, arcRadius, tooltip, svg, arcGroup;

  function publicInit(){
    renderAggregateCrimeData();
  }

  function formatGameDate(date){
    return date.slice(0,10);
  }

  function publicRender(date){
    if (date){
      renderAggregateCrimeDataByDate(date);
    } else {
      renderAggregateCrimeData();
    }
  }

  function displayNumberOfCrimesAndDate(number, date){
    if (date){
      var formattedDate = formatGameDate(date);
    } else {
      formattedDate = "2014";
    }

    var $crimeTotal = $("#crime-total");
    var totalCrimeTemplate =  _.template($("#crime-total-template").html())({number:number, date: formattedDate});
    $crimeTotal.empty();
    $crimeTotal.append(totalCrimeTemplate);
  }

  function renderAggregateCrimeData(){
    DataFetcher.getAggregateCrimeData({}, function(data){
      var totalCrimeFigure = 0;
      data.forEach(function(crime){
        crime.total = +crime.total;
        totalCrimeFigure += crime.total;
      });
      displayNumberOfCrimesAndDate(totalCrimeFigure);
      drawPie(data);
    });
  }

  function renderAggregateCrimeDataByDate(date){
    DataFetcher.getAggregateCrimeData({date:date}, function(data){
      var totalCrimeFigure = 0;
      data.forEach(function(crime){
        crime.total = +crime.total;
        totalCrimeFigure += crime.total;
      });
      displayNumberOfCrimesAndDate(totalCrimeFigure, date);
      drawPie(data);
    });
  }

  function drawPie(data){
    width = width || 600;
    height = height || 350;
    radius = radius || (width/2) - 10;
    color =  color || d3.scale.category20c();

    pie = pie || d3.layout.pie()
      .value(function(d) { return d.total; })
      .startAngle(0)
      .endAngle(Math.PI);

    arcRadius = arcRadius || d3.svg.arc()
    .innerRadius(radius - 150)
    .outerRadius(radius - 20);

    tooltip = tooltip || d3.select("body").append('div')
    .attr('class', 'pie-tooltip')
    .style('opacity', 0);

    svg = svg || d3.select("#pie-chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + width/2 + ")" + "rotate(" + 270 +")");
    var arcGroup = svg.selectAll(".arc").data(pie(data));
        arcGroup.enter().append("g")
            .attr("class", "arc")
        arcGroup.exit().remove();
    var arcPath = arcGroup.selectAll("path").data(pie(data))
        arcPath.enter().append("path");
        arcPath.transition().duration(500)
            .attr("d", arcRadius)
            .style("fill", function(d){ return color(d.data.event_clearance_group); });
        arcPath.exit().remove();
    arcPath.on('mouseover', function(d, i){
      d3.select(this).transition()
        .style("fill", "orangered")
      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      tooltip.html('Crime: ' + d.data.event_clearance_group + '<br/> Number of incidents: ' + d.data.total)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 30) + 'px');
    })
      .on('mouseout', function(d){
        d3.select(this).transition()
          .style("fill", function(d){ return color(d.data.event_clearance_group)} );
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      })
     .on('click', function(d){
        svg.selectAll(".selected").classed("selected", false);
        d3.select(this).attr("class", "selected");
        this.parentNode.appendChild(this);
        amplify.publish("pieClick", {data:d.data});
      });
  }

  return {
    init:publicInit,
    render:publicRender
  }

}(d3, DataFetcher));