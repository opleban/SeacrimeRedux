var PieChart = (function(d3, DataFetcher){
  var width, height, radius, pie, color, arcRadius, tooltip, svg, arcGroup;

  function publicInit(){
    renderAggregateCrimeData();
  }

  function publicRender(date){
    if (date){
      renderAggregateCrimeDataByDate(date);
    } else {
      renderAggregateCrimeData();
    }
  }

  function renderAggregateCrimeData(){
    DataFetcher.getAggregateCrimeData(function(data){
      var totalCrimeFigure = 0;
      data.forEach(function(crime){
        crime.total = +crime.total;
        totalCrimeFigure += crime.total;
      });
      drawPie(data);
    });
  }

  function renderAggregateCrimeDataByDate(date){
    DataFetcher.getAggregateCrimeDataByDate(date, function(data){
      var totalCrimeFigure = 0;
      data.forEach(function(crime){
        crime.total = +crime.total;
        totalCrimeFigure += crime.total;
      });
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
    console.log("calculating arc");
    var arcGroup = svg.selectAll(".arc").data(pie(data));
        arcGroup.enter().append("g")
            .attr("class", "arc")
        arcGroup.exit().remove();
    var arcPath = arcGroup.selectAll("path").data(pie(data))
        arcPath.enter().append("path");
        arcPath.transition().duration(500)
            .attr("d", arcRadius)
            .style("fill", function(d){ return color(d.data.event_clearance_group); });
        console.log(arcPath);
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
        amplify.publish("pieClick", {data:d.data});
      });
  }

  return {
    init:publicInit,
    render:publicRender
  }

}(d3, DataFetcher));