var BarChart = (function(d3){

  var Chart = function (options){
    this.margin = options.margin;
    this.width = options.width;
    this.height = options.height;
    this.el = options.el;
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
    var chartTitle = that.svg.selectAll('text.chart-title').data([eventGroup]);
    chartTitle.enter().append("text");
    chartTitle
      .attr('class', 'chart-title')
      .text(eventGroup)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '20px')
      .attr('fill', 'black')
      .attr('x', that.width/2)
      .attr('y', 15);
  };

  Chart.prototype.setAxes = function(data){
    var that = this;
    that.x = d3.scale.ordinal()
      .rangeRoundBands([0, that.width], 0, 0)
      .domain(data.map(function(d){ return d.month; }));

    that.y = d3.scale.linear()
      .range([that.height, 25])
      .domain([0, d3.max(data, function(d) { return d.total; })]);

    that.xAxis = d3.svg.axis()
      .scale(that.x)
      .ticks(data.length)
      .orient("bottom");

    that.ticks = that.svg.selectAll("g.tick").data(data);
    that.ticks.enter().append("g.tick");
    that.ticks.text(function(d) { return d.total; });
    that.ticks.exit().remove();
  };

  Chart.prototype.drawBars = function(data){
    var rect, barWidth, barText;
    var that = this;
    barWidth = Math.floor(this.width / data.length) - 7;
    rect = this.svg.selectAll("rect").data(data);
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

    barText = that.svg.selectAll("text.bar-text").data(data);
    barText.enter().append("text");
    barText.transition().duration(500)
      .attr("class", "bar-text")
      .text(function(d) { return d.total; })
      .attr("x", function(d, i){ return i * (that.width/data.length) + barWidth/2; })
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

  Chart.prototype.drawMonthly = function(data, eventGroup){
    var that = this;
    that.setDimensions(data);
    that.drawChartTitle(eventGroup);
    that.setAxes(data);
    that.drawBars(data);
    that.drawXAxis();
  };

  return{
    Chart: Chart,
  };
}(d3));