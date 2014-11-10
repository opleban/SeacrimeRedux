var PieChart = (function(d3){
  function formatGameDate(date){
    return date.slice(0,10);
  }

  var Chart = function(options){
    this.width = options.width;
    this.height = options.height;
    this.el = options.el;
    this.radius = (options.width/2) - 10;
    this.color = d3.scale.category20c();
  };

  Chart.prototype.setDimensions = function(){
    var that = this;
    that.svg = that.svg || d3.select(that.el).append("svg")
        .attr("width", that.width)
        .attr("height", that.height)
        .append("g")
        .attr("transform", "translate(" + that.width/2 + "," + (that.width+50)/2 + ")" + "rotate(" + 270 +")");

    that.pie = d3.layout.pie()
      .value(function(d) { return d.total; })
      .startAngle(0)
      .endAngle(Math.PI);

    that.arcRadius = d3.svg.arc()
      .innerRadius(that.radius - 150)
      .outerRadius(that.radius - 30);
  };

  Chart.prototype.setTooltip = function(){
    var that = this;
    that.tooltip = that.tooltip || d3.select("body").append('div')
      .attr('class', 'pie-tooltip')
      .style('opacity', 0);
  };

  Chart.prototype.setChartHeader = function(totalCrimeFigure){
    var that = this;
    that.crimeFigureHeader = that.svg.append('text')
      .attr('class', 'total-crimes')
      .text('Total number of reported crimes: ' + totalCrimeFigure)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '20px')
      .attr('fill', 'black')
      .attr('transform', 'translate(' + that.width/2 + ',' + '0' + ')' + 'rotate(' + 90 +')');
    that.crimeDateHeader = that.svg.append('text')
      .attr('class', 'crime-date')
      .text('(2014)')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '20px')
      .attr('fill', 'black')
      .attr('transform', 'translate(' + 270 + ',' + "0" + ')' + 'rotate(' + 90 +')');

  };

  Chart.prototype.updateChartHeader = function(totalCrimeFigure, date){
    var that = this;
    var formattedDate = date ? formatGameDate(date) : "2014";
    that.crimeFigureHeader.text('Total number of reported crimes: ' + totalCrimeFigure)
    that.crimeDateHeader.text( '(' + formattedDate + ')' );
  };

  Chart.prototype.setPieArc = function(data){
    var that = this;
    var arcGroup, arcPath;
    arcGroup = that.svg.selectAll('.arc').data(that.pie(data));
    arcGroup.enter().append('g')
        .attr('class', 'arc');
    arcGroup.exit().remove();

    arcPath = arcGroup.selectAll('path').data(that.pie(data));
    arcPath.enter().append('path');
    arcPath.transition().duration(500)
        .attr('d', that.arcRadius)
        .style('fill', function(d){ return that.color(d.data.event_clearance_group); });
    arcPath.exit().remove();

    arcPath.on('mouseover', function(d, i){
      d3.select(this).transition()
        .style("fill", "orangered");
      that.tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      that.tooltip.html('Crime: ' + d.data.event_clearance_group + '<br/> Number of incidents: ' + d.data.total)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 30) + 'px');
    });

    arcPath.on('mouseout', function(d){
        d3.select(this).transition()
          .style("fill", function(d){ return that.color(d.data.event_clearance_group)} );
        that.tooltip.transition()
          .duration(200)
          .style('opacity', 0);
    });

    arcPath.on('click', function(d){
      that.svg.selectAll(".selected").classed("selected", false);
      d3.select(this).attr("class", "selected");
      this.parentNode.appendChild(this);
      amplify.publish("pieClick", {data:d.data});
    });
  };

  Chart.prototype.draw = function(data, totalCrimeFigure){
    var that = this;
    that.setDimensions();
    that.setTooltip();
    that.setChartHeader(totalCrimeFigure);
    that.setPieArc(data);
  };

  Chart.prototype.update = function(data, totalCrimeFigure, date){
    var that = this;
    that.updateChartHeader(totalCrimeFigure, date);
    that.setPieArc(data);
  };

  return {
    Chart: Chart,
  };

}(d3));