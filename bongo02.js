// http://johnny-five.io/api/sensor/
var five = require('johnny-five');
var board = new five.Board();
var robot = require('robotjs');
var _ = require('lodash');

const TAB = 'tab';
const ENTER = 'enter';

function navigateOrEnter(prev, cur, key=TAB) {
  if( !prev && (cur) >= 1 ) {
    console.log('key', key)
    switch(key) {
      case ENTER:
      enter();
      return;

      default:
      navigate()
    }
  }
}

const navigateOrEnterDebounce = _.debounce(navigateOrEnter);

function navigate(prev, cur) {
  // if( !prev && (cur) >= 1 ) {
    // robot.typeString("navigate | ");
    // robot.keyTap('tab');
  // }
}

function enter(prev, cur) {
  // if( !prev && (cur) >= 1 ) {
    // robot.typeString("  enter | ");
    // robot.keyTap('enter');
  // }
}

class BongoControl extends five.Sensor {
  constructor(sensorAddr, intervalFunc, period, key) {
    super(sensorAddr);

    this.amplitude = 0;
    this.key = key;
    this.intervalFunc = intervalFunc;
    this.period = period;
    this.prev = null;



    this.interval = () => {
      const cur = this.getVelo();
      this.intervalFunc(this.prev, cur, this.key);
      this.prev = cur;
      this.reset();
    };

    setInterval(
      this.interval,
      this.period
    );
  }

  getVelo(){
    return this.amplitude/this.period * 100;
  }

  reset(){
    this.amplitude = 0;
  }

  setAmp(val){
    this.amplitude += val;
  }
}

// notes on analog
// you have to go into system preferences
// and go to security and privacy
// and explicitly let iterm control your computer
board.on('ready', function() {

  const bongo01 = new BongoControl(
    'A0',
    navigateOrEnterDebounce,
    50,
    TAB,
  );

  const bongo02 = new BongoControl(
    'A1',
    navigateOrEnterDebounce,
    50,
    ENTER,
  );

  bongo01.on('change', function() {
    this.setAmp(this.scaleTo(0, this.period));
  });

  bongo02.on('change', function() {
    this.setAmp(this.scaleTo(0, this.period));
  });

});
