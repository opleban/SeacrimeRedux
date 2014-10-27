var ChartView = (function($, d3, DataFetcher){

  function getYear(dateString){
    return dateString.slice(0, 5);
  }
  return {
    // renderBarGraph: function(eventGroup){
    //   var margin = {top: 20, right: 20, bottom: 10, left: 20};
    //   var width = 400 - margin.left - margin.right;
    //   var height = 400 - margin.top - margin.bottom;
    //   var barWidth = Math.floor(width / 12) - 1;

    //   var svg = d3.select("#bar-chart").append("svg")
    //         .attr("width", width + margin.left + margin.right)
    //         .attr("height", height + margin.top + margin.bottom)
    //       .append("g")
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //   DataFetcher.getCrimeDataByEventGroup(eventGroup, function(data){
    //     data.forEach(function(d) {
    //       d.date = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(d.date);
    //       d.month = getMonthName(d.date.getMonth());
    //       d.total = +d.total;
    //     });

    //     var x = d3.scale.ordinal()
    //         .rangeRoundBands([0, width], 0, 0)
    //         .domain(data.map(function(d){ return d.month; }));

    //     var y = d3.scale.linear()
    //         .range([height, 0])
    //         .domain([0, d3.max(data, function(d) { return d.total; })]);

    //     var xAxis = d3.svg.axis()
    //         .scale(x)
    //         .orient("bottom");

    //     var yAxis = d3.svg.axis()
    //         .scale(y)
    //         .orient("left");

    //     var bars = svg.selectAll("rect")
    //                 .data(data)
    //               .enter().append("rect")
    //                 .style("fill", "#4EAE47" )
    //                 .attr("class", "bar")
    //                 .attr("width", barWidth)
    //                 .attr("x", function(d){ return x(d.month); })
    //                 .attr("y", function(d){ return y(d.total); })
    //                 .attr("height", function(d){ return height - margin.top - margin.bottom - y(d.total); });
    //     var barText = svg.selectAll("text")
    //                 .data(data)
    //               .enter().append("text")
    //                 .attr("class", "bar-text")
    //                 .text(function(d) { return d.total; })
    //                 .attr("x", function(d, i){return i * (width/data.length) + barWidth/2;
    //                 })
    //                 .attr("y", function(d) { return y(d.total) - 3; })
    //                 .attr("font-family", "sans-serif")
    //                 .attr("text-anchor", "middle")
    //                 .attr("font-size", "11px")
    //                 .attr("fill", "steelblue");
    //     svg.append("g")
    //         .attr("class", "axis")
    //         .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
    //         .call(xAxis);
    //   });
    // },

    renderHalfPieChart: function(){
      var width = 600;
      var height = 350;
      var radius = (width/2) - 10;
      var color = d3.scale.category20();
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
          });
      });
    }
  };
}(jQuery, d3, DataFetcher));
