//Bar Chart as a constructor and instantiate a new bar chart
var BarChart = (function(d3, DataFetcher){

  function getMonthName(monthNumber){
    var MONTH_NAME = {0:'Jan',  1:'Feb' , 2:'Mar' , 3:'Apr', 4:'May', 5:'Jun' , 6:'Jul', 7:'Aug', 8:'Sept', 9:'Oct', 10:'Nov', 11:'Dec'};
    return MONTH_NAME[monthNumber];
  }

  var Chart = function (options){
    this.margin = options.margin;
    this.width = options.width;
    this.height = options.height;
    this.el = options.el;
  };

  Chart.prototype.getMonthlyData = function(eventGroup, callbackFn){
    var that = this;
    DataFetcher.getAggregateMonthlyCrimeDataByEventGroup(eventGroup, function(data){
      data.forEach(function(d) {
        d.date = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(d.date);
        d.month = getMonthName(d.date.getMonth());
        d.total = +d.total;
      });
      that.data = data;
      // Chart drawing occurs in callback function after data is fetched.
      callbackFn();
    });
  };

  Chart.prototype.setDimensions = function(){
    var that = this;
    that.svg = that.svg || d3.select(that.el).append('svg');
    that.svg
      .attr('width', that.width)
      .attr('height', that.height);
  };

  Chart.prototype.drawChartTitle = function(eventGroup){
    var that = this;
    var chartTitle = that.svg.selectAll("text.chart-title") || that.svg.append("text.chart-title");
    chartTitle.datum([eventGroup])
      .attr("class", "chart-title")
      .text(eventGroup)
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "20px")
      .attr("fill", "black")
      .attr("x", that.width/2)
      .attr("y", 15);
  };

  Chart.prototype.setAxes = function(){
    var that = this;
    that.x = d3.scale.ordinal()
      .rangeRoundBands([0, that.width], 0, 0)
      .domain(that.data.map(function(d){ return d.month; }));

    that.y = d3.scale.linear()
      .range([that.height, 25])
      .domain([0, d3.max(that.data, function(d) { return d.total; })]);

    that.xAxis = d3.svg.axis()
      .scale(that.x)
      .ticks(that.data.length)
      .orient("bottom");

    that.ticks = that.svg.selectAll("g.tick").data(that.data);
    that.ticks.enter().append("g.tick");
    that.ticks.text(function(d) { return d.total; });
    that.ticks.exit().remove();
  };

  Chart.prototype.drawBars = function(){
    var rect, barWidth, barText;
    var that = this;
    barWidth = Math.floor(this.width / this.data.length) - 7;
    rect = this.svg.selectAll("rect").data(this.data);
    rect.enter().append("rect");
    rect.transition().duration(500)
      .style("fill", "#4EAE47")
      .attr("class", "bar")
      .attr("width", barWidth)
      .attr("x", function(d){ return that.x(d.month); })
      .attr("y", function(d){ return that.y(d.total); })
      .attr("height", function(d){
        return that.height - that.margin.top - that.margin.bottom - that.y(d.total);
      });
    rect.exit().remove();

    barText = that.svg.selectAll("text.bar-text").data(that.data);
    barText.enter().append("text");
    barText.transition().duration(500)
      .attr("class", "bar-text")
      .text(function(d) { return d.total; })
      .attr("x", function(d, i){ return i * (that.width/that.data.length) + barWidth/2; })
      .attr("y", function(d){return that.y(d.total) + 13; })
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("fill", "white");
    barText.exit().remove();
  };

  Chart.prototype.drawXAxis = function(){
    var that = this;
    that.svg.append("g")
      .attr("class", "axis")
      .attr('transform', 'translate(0, ' + (that.height - that.margin.top - that.margin.bottom) + ')')
      .call(that.xAxis);
  };

  Chart.prototype.drawMonthly = function(eventGroup){
    var that = this;
    that.getMonthlyData(eventGroup, function(){
      that.setDimensions();
      that.drawChartTitle();
      that.setAxes();
      that.drawBars();
      that.drawXAxis();
    });
  };




  // //Sets svg dimensions
  // var margin = {top: 20, right: 20, bottom: 10, left: 20};
  // var width = 400;
  // var height = 400;

  // //appends svg element to bar-chart div
  // var svg = d3.select('#bar-chart').append('svg')
  //     .attr('width', width)
  //     .attr('height', height);

  return{
    Chart: Chart,
    // draw function, creates the bar graph
    // It is also called to update the bar graph
    // draw: function(eventGroup){
    //   var chartTitle = svg.selectAll("text.chart-title").data([eventGroup]);
    //   chartTitle.enter().append("text");
    //   chartTitle.transition().duration(500)
    //     .attr("class", "chart-title")
    //     .text(eventGroup)
    //     .attr("text-anchor", "middle")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "20px")
    //     .attr("fill", "black")
    //     .attr("x", width/2)
    //     .attr("y", 15);

    //   DataFetcher.getAggregateMonthlyCrimeDataByEventGroup(eventGroup, function(data){
    //     data.forEach( function(d) {
    //       d.date = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(d.date);
    //       d.month = getMonthName(d.date.getMonth());
    //       d.total = +d.total;
    //     });
    //     //Uses ordinal scale for each month of the year
    //     var barWidth = Math.floor(width / data.length) - 7;
    //     var x = d3.scale.ordinal()
    //       .rangeRoundBands([0, width], 0, 0)
    //       .domain(data.map(function(d){ return d.month; }));

    //     var y = d3.scale.linear()
    //       .range([height, 25])
    //       .domain([0, d3.max(data, function(d) { return d.total; })]);

    //     var xAxis = d3.svg.axis()
    //       .scale(x)
    //       .ticks(data.length)
    //       .orient("bottom");

    //     var rect = svg.selectAll("rect").data(data);
    //     rect.enter().append("rect");
    //     rect.transition().duration(500)
    //       .style("fill", "#4EAE47")
    //       .attr("class", "bar")
    //       .attr("width", barWidth)
    //       .attr("x", function(d){ return x(d.month); })
    //       .attr("y", function(d){ return y(d.total); })
    //       .attr("height", function(d){
    //         return height - margin.top - margin.bottom - y(d.total);
    //       });
    //     rect.exit().remove();

    //     var tick = svg.selectAll("g.tick").data(data);
    //         tick.enter().append("g.tick");
    //         tick.text(function(d) { return d.total; });
    //         tick.exit().remove();

    //     var barText = svg.selectAll("text.bar-text").data(data);
    //     barText.enter().append("text");
    //     barText.transition().duration(500)
    //       .attr("class", "bar-text")
    //       .text(function(d) { return d.total; })
    //       .attr("x", function(d, i){ return i * (width/data.length) + barWidth/2; })
    //       .attr("y", function(d){return y(d.total) + 13; })
    //       .attr("font-family", "sans-serif")
    //       .attr("text-anchor", "middle")
    //       .attr("font-size", "13px")
    //       .attr("fill", "white");
    //     barText.exit().remove();

    //     svg.append("g")
    //       .attr("class", "axis")
    //       .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
    //       .call(xAxis);

    //   });
    // }
  };
}(d3, DataFetcher));