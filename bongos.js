// http://johnny-five.io/api/sensor/
var five = require('johnny-five');
var board = new five.Board();
var robot = require('robotjs');

const period = 50;

function navigate(prev, cur) {
  console.log('navigate...')
  // robot.typeString("navigate | ");
  robot.keyTap('tab');
}

function enter(prev, cur) {
  console.log('  enter...')
  // robot.typeString("  enter | ");
  robot.keyTap('enter');
}

class BongoControl extends five.Sensor {
  constructor(sensorAddr, action) {
    super(sensorAddr);

    this.action = action;
    this.vibration = 0;
    this.prev = null;
  }

}

// notes on using robotjs:
// you have to go into system preferences
// and go to security and privacy
// and explicitly let iterm or bash control your computer
board.on('ready', function() {

  const bongo01 = new BongoControl(
    'A0',
    navigate,
  );

  const bongo02 = new BongoControl(
    'A1',
    enter,
  );

  bongo01.on('change', function() {
    this.vibration += this.scaleTo(0, period);
  });

  bongo02.on('change', function() {
    this.vibration += this.scaleTo(0, period);
  });

  function ineterval() {
    const amplitude1 = bongo01.vibration/period * 100;
    const amplitude2 = bongo02.vibration/period * 100;

    // if it's 0
    // could actually check changes in amplitude from prev to now
    // might work better?
    if( !bongo01.prev && amplitude1 || !bongo02.prev && amplitude2 ) {
      if(amplitude1 >= 6) { // navigate
        bongo01.action();
      } else if(amplitude2 >= 22) { //enter
        bongo02.action()
      }
    }

    bongo01.prev = amplitude1;
    bongo01.vibration = 0;
    bongo02.prev = amplitude2;
    bongo02.vibration = 0;
  }

  setInterval(ineterval, period);
});
