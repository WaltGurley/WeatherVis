var now = new Date();
var source;
var weatherData;

if (now.getMinutes() % 3 === 0) {
  source = "http://api.wunderground.com/api/" +
    "9242b19d20a83670" +
    "/conditions/q/pws:KNCRALEI108.json";
    console.log("got WU")
} else {
  source = "js/test.json";
  console.log("got local")
}

//load json data using d3
d3.json(source, function(data) {
  weatherData = data;

  fs.writeFile("test2.json", weatherData, function(err) {
    if (err) throw err;
  });

  //draw circles with centers on pentagon corners
  function drawPentCircles(x, y, r) {
    var centerX = x;
    var centerY = y;
    var circleRadius = r;

    var h = circleRadius / (Math.sin(36 * (Math.PI / 180)));
    var angle1 = 72 * (Math.PI / 180);
    var angle2 = 54 * (Math.PI / 180);

    var points = [];

    points.push([centerX, centerY - h]);
    points.push([centerX + Math.sin(angle1) * h, centerY - Math.cos(angle1) * h]);
    points.push([x + circleRadius, centerY + Math.sin(angle2) * h]);
    points.push([x - circleRadius, centerY + Math.sin(angle2) * h]);
    points.push([centerX - Math.sin(angle1) * h, centerY - Math.cos(angle1) * h]);

    return points;
  }

  var svg = d3.select(".vis-container").append("svg")
    .attr({
      "class": "svg-vis"
    });

    var svgWidth = parseInt(svg.style("width").split("p")[0]),
      svgHeight = parseInt(svg.style("height").split("p")[0]),
      circleRadius = 75;

  var centerPoints = drawPentCircles(svgWidth / 2, svgHeight / 2, circleRadius);

  circles = svg.selectAll("dataCircles")
    .data(centerPoints)
    .enter().append("circle")
    .attr({
      "r": circleRadius,
      "cx": function(d) { return d[0]; },
      "cy": function(d) { return d[1]; },
      "fill": "#000"
    });
});
