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
