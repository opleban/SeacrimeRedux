var BarGraph = (function(d3, DataFetcher){

  function getMonthName(monthNumber){
    var MONTH_NAME = {0:"Jan",  1:"Feb" , 2:"Mar" , 3:"Apr", 4:"May", 5:"Jun" , 6:"Jul", 7:"Aug", 8:"Sept", 9:"Oct", 10:"Nov", 11:"Dec"};
    return MONTH_NAME[monthNumber];
  }

  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var width = 400 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var svg = d3.select("#bar-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

  return{
    draw: function(eventGroup){
      console.log("in draw");
      DataFetcher.getCrimeDataByEventGroup(eventGroup, function(data){
        data.forEach( function(d) {
          d.date = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(d.date);
          d.month = getMonthName(d.date.getMonth());
          d.total = +d.total;
        });

        var barWidth = Math.floor(width / data.length) - 7;
        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0, 0)
          .domain(data.map(function(d){ return d.month; }));

        var y = d3.scale.linear()
          .range([height, 0])
          .domain([0, d3.max(data, function(d) { return d.total; })]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .ticks(data.length)
          .orient("bottom");

        var rect = svg.selectAll("rect").data(data);
        rect.enter().append("rect");
        rect.transition().duration(1000)
          .style("fill", "#4EAE47")
          .attr("class", "bar")
          .attr("width", barWidth)
          .attr("x", function(d){ return x(d.month); })
          .attr("y", function(d){ return y(d.total); })
          .attr("height", function(d){
            return height - margin.top - margin.bottom - y(d.total);
          });
        rect.exit().remove();

        var tick = svg.selectAll("g.tick").data(data)
          .text(function(d) { return d.total; });
        tick.exit().remove();

        var text = svg.selectAll("text").data(data);
        text.enter().append("text");
        text.transition().duration(1000)
          .attr("class", "bar-text")
          .text(function(d) { return d.total; })
          .attr("x", function(d, i){ return i * (width/data.length) + barWidth/2; })
          .attr("y", function(d){return y(d.total) + 13; })
          .attr("font-family", "sans-serif")
          .attr("text-anchor", "middle")
          .attr("font-size", "13px")
          .attr("fill", "white");
        text.exit().remove();

        svg.append("g")
          .attr("class", "axis")
          .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
          .call(xAxis);

      });
    },

    update: function(eventGroup){
      console.log("in update");
      DataFetcher.getCrimeDataByEventGroup(eventGroup, function(data){
        data.forEach( function(d) {
          d.date = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(d.date);
          d.month = getMonthName(d.date.getMonth());
          d.total = +d.total;
        });

        x.domain(data.map(function(d){ return d.month; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]);

        xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        svg.select(".axis")
          .transition()
          .duration(1000)
          .call(xAxis);

        svg.selectAll("rect")
          .data(data)
          .exit()
            .transition()
            .remove();
        svg.selectAll("rect")
          .data(data)
          .transition()
          .duration(1000)
          .attr("x", function(d){ return x(d.month); })
          .attr("y", function(d){ return y(d.total); })
          .attr("height", function(d){
            return height - margin.top - margin.bottom - y(d.total);
          })
        svg.selectAll("text")
          .data(data)
          .exit()
            .transition()
            .remove();
        svg.selectAll("text")
          .data(data)
          .transition()
          .duration(1000)
          .text(function(d) { return d.total; })
          .attr("x", function(d, i){
            return i * (width/data.length) + barWidth/2;
          })
          .attr("y", function(d) {
            return y(d.total) - 3;
          })
      });
    }
  };
}(d3, DataFetcher));

BarGraph.draw("CAR PROWL");
// BarGraph.update("PROSTITUTION");