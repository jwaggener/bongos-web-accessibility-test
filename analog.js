// http://johnny-five.io/api/sensor/
var five = require('johnny-five');
var board = new five.Board();
var robot = require('robotjs');

var prev = 0;

var period = 50; //ms
var amplitude = 0; // 0 - period

function navigate() {
  robot.keyTap('tab');
}

function reset(){
  amplitude = 0;
}

function getVelo(){
  return amplitude/period * 100;
}

class BongoControl {

  constructor({intervalFunc, period, sensorAddr}) {
    this.amplitude = 0;

    this.period = period;
    this.prev = null;
    this.sensor = new five.Sensor(sensorAddr);
    this.sensor.on('change', function() {
      this.amplitude += this.scaleTo(0, period);
    });

    this.intervalFunc = () => {
      const cur = this.getVelo();
      intervalFunc(this.prev, this.getVelo())
      this.prev = cur;
      reset();
    };

    setInterval(this.intervalFunc, this.period);
  }

  getVelo(){
    return this.amplitude/this.period * 100;
  }

  reset(){
    this.amplitude = 0;
  }
}
// notes on analog
// you have to go into system preferences
// and go to security and privacy
// and explicitly let iterm control your computer
board.on('ready', function() {

  var sensor01 = new five.Sensor('A0');
  var sensor02 = new five.Sensor('A1');

  setInterval(
    () => {
      const cur = getVelo();
      if( !prev && (cur) >= 1 ) {
        navigate();
      }
      prev = cur;
      reset();
    }, period);

  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  sensor01.on('change', function() {
    const n = this.scaleTo(0, period);
    amplitude += n;
  });

  sensor02.on('change', function() {

    const n = this.scaleTo(0, period);
    console.log('HELLO!');

  });
});

// robot.typeString("some foo shit ...");
