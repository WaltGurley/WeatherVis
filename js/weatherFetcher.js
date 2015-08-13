var fs = require("fs");
var http = require("http");
var now = new Date();

loadWeather();

function loadWeather() {
  fs.readFile("curCond.json", "utf8", function(err, data) {
    if (err) throw err;
    console.log(data);
  });
}

var loadTimer = setInterval(fetchWeather, 180000);

function fetchWeather() {
  var data = "";
  var source = "http://api.wunderground.com/api/" +
    "9242b19d20a83670" + //API Key
    "/conditions/q/pws:KNCRALEI108.json"; //Query current conditions

  http.get(source, function(res) {
    res.on("data", function(chunk) {
      data += chunk;
    });

    res.on("end", function() {
      fs.writeFile("curCond.json", data, function(err) {
        if (err) throw err;
      });

      loadWeather();
      console.log(data);
    });
  })
  .on("error", function(err) {
    console.log(err.message);
  });
}
