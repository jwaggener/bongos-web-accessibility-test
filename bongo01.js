// http://johnny-five.io/api/sensor/
var five = require('johnny-five');
var board = new five.Board();
var robot = require('robotjs');

function navigate(prev, cur) {
  if( !prev && (cur) >= 1 ) {
    robot.typeString("navigate | ");
    // robot.keyTap('tab');
  }
}

function enter(prev, cur) {
  if( !prev && (cur) >= 1 ) {
    robot.typeString("  enter | ");
    // robot.keyTap('enter');
  }
}

class BongoControl {

  constructor({intervalFunc, period, sensorAddr}) {

    this.amplitude = 0;
    this.period = period;
    this.prev = null;
    this.sensor = new five.Sensor(sensorAddr);

    function setAmp (val) {
      this.amplitude += val;
    }
    const setAmpBound = setAmp.bind(this);

    this.sensor.on('change', function() {
      setAmpBound(this.scaleTo(0, period));
    });

    this.intervalFunc = () => {
      const cur = this.getVelo();
      intervalFunc(this.prev, cur);
      this.prev = cur;
      this.reset();
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

  const bongo01 = new BongoControl({
    intervalFunc: navigate,
    period: 50,
    sensorAddr: 'A0',
  });

  const bongo02 = new BongoControl({
    intervalFunc: enter,
    period: 50,
    sensorAddr: 'A1',
  });

});
