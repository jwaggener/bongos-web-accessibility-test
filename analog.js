// http://johnny-five.io/api/sensor/
var five = require("johnny-five");
var board = new five.Board();
var robot = require("robotjs");

board.on("ready", function() {
  var sensor = new five.Sensor("A0");

  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  sensor.on("change", function() {
    const n = this.scaleTo(0, 100);
    if(n > 15){
      robot.typeString("some foo shit ...");
      // robot.keyTap("tab");
    }
    console.log(this.scaleTo(0, 100));
    console.log('');
  });
});
