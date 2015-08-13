var source;
var weatherData;

//load json data using d3
d3.json("js/curCond.json", function(data) {
  weatherData = data;

  //draw circles with centers on pentagon corners
  function drawPentCircles(x, y, r, h) {
    var centerX = x;
    var centerY = y;
    var circleRadius = r;

    // perfectly edged: distance = circleRadius / (Math.sin(36 * (Math.PI / 180)))
    var distance = h || circleRadius / (Math.sin(36 * (Math.PI / 180)));
    var angle1 = 72 * (Math.PI / 180);
    var angle2 = 54 * (Math.PI / 180);

    var points = [];

    points.push({
      "x": centerX,
      "y": centerY - distance
    });
    points.push({
      "x": centerX + Math.sin(angle1) * distance,
      "y": centerY - Math.cos(angle1) * distance
    });
    points.push({
      "x": x + Math.cos(angle2) * distance,
      "y": centerY + Math.sin(angle2) * distance
    });
    points.push({
      "x": x - Math.cos(angle2) * distance,
      "y": centerY + Math.sin(angle2) * distance
    });
    points.push({
      "x": centerX - Math.sin(angle1) * distance,
      "y": centerY - Math.cos(angle1) * distance
    });

    return points;
  }

  var svg = d3.select(".vis-container").append("svg")
    .attr("class", "svg-vis");

  var svgWidth = parseInt(svg.style("width")),
    svgHeight = parseInt(svg.style("height")),
    circleRadius = 75,
    distance = circleRadius * 2;

  var centerPoints = drawPentCircles(svgWidth / 2, svgHeight / 2, circleRadius, distance);

  var circles = svg.selectAll("dataCircles")
    .data(centerPoints)
    .enter().append("circle")
    .attr({
      "class": "data-circles",
      "r": circleRadius,
      "cx": function(d) { return d.x; },
      "cy": function(d) { return d.y; }
    });

  var circleText = svg.selectAll("text")
    .data(centerPoints)
    .enter().append("text")
    .attr({
      "class": "data-circles-text",
      "x": function(d) { return d.x; },
      "y": function(d) { return d.y; },
      "text-anchor": "middle"
    })
    .text("holder");

    //function to get current time, format, and return in proper form
  function updateTime() {
    var now = new Date();

    var formatSeconds = d3.time.format("%S"),
      formatMinutes = d3.time.format("%M"),
      formatHours = d3.time.format("%H");

    var time = [
      {"text": formatSeconds(now), "segment": now.getSeconds() / 60 * 2 * Math.PI, "oldSeg": 0},
      {"text": formatMinutes(now), "segment": now.getMinutes() / 60 * 2 * Math.PI, "oldSeg": 0},
      {"text": formatHours(now), "segment": now.getHours() / 24 * 2 * Math.PI, "oldSeg": 0}
    ];

    return time;
  }

  //function for draw initial polar clock
  function setupPolarClock() {
    var time = updateTime();

    var arc = d3.svg.arc()
      .startAngle(0)
      .endAngle(function(d) { return d.segment; })
      .innerRadius(function(d, i) {
        return i * circleRadius * 2 / time.length + (distance + circleRadius);
      })
      .outerRadius(function(d, i) {
        return (i + 1) * circleRadius * 2 / time.length + (distance + circleRadius);
      });

    var arcs = svg.selectAll("path")
      .data(updateTime)
      .enter().append("path")
      .attr({
        "d": arc,
        "transform": "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")"
      })
      .style("fill", "#000");

    function clockTick() {
      arcs.each(function(d) { this._segment = d.segment; });
      arcs.data(updateTime)
        .each(function(d) { d.oldSeg = this._segment; })
        .transition()
          .call(arcTween);
    }

    tick = setInterval(clockTick, 1000);

    function arcTween(transition) {
      transition.attrTween("d", function(d) {
        var interpolate = d3.interpolate(d.oldSeg, d.segment);
        return function(t) {
          d.segment = interpolate(t);
          console.log(d.segment)
          return arc(d);
        };
      });
    }
  }

  setupPolarClock();

});
