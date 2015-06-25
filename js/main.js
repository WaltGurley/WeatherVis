//load json data using d3
var weatherData;
d3.json("js/test.json", function(data) {
  weatherData = data;
  var uv = weatherData.current_observation.UV;
  console.log(uv);
});
