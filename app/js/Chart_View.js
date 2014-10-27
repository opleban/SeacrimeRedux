var ChartView = (function($, d3, DataFetcher, BarGraph){

  function getYear(dateString){
    return dateString.slice(0, 5);
  }
  function drawBarGraph(eventGroup){
    BarGraph.draw(eventGroup);
  }
  return {

    renderHalfPieChart: function(){
      var width = 600;
      var height = 350;
      var radius = (width/2) - 10;
      var color = d3.scale.category20c();
      var tooltip = d3.select("body").append('div')
          .attr('class', 'pie-tooltip')
          .style('opacity', 0);

      var pie = d3.layout.pie()
          .value(function(d) {return d.total; })
          .startAngle(0)
          .endAngle(Math.PI);

      var arc = d3.svg.arc()
          .innerRadius(radius - 150)
          .outerRadius(radius - 20);

      var svg = d3.select("#pie-chart").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + width/2 + ")" + "rotate(" + 270 +")");

      var path = svg.selectAll("path");

      DataFetcher.getAggregateCrimeData(function(data){
        data.forEach(function(crime){
          crime.total = +crime.total;
        });

        var g = svg.selectAll(".arc")
            .data(pie(data))
          .enter().append("g")
            .attr("class", "arc");

        g.append("path").attr("d", arc)
          .style("fill", function(d){ return color(d.data.event_clearance_group); })
          .on('mouseover', function(d, i){
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
            drawBarGraph(d.data.event_clearance_group);
          })
      });
    }
  };
}(jQuery, d3, DataFetcher, BarGraph));
