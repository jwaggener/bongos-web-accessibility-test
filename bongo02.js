// http://johnny-five.io/api/sensor/
var five = require('johnny-five');
var board = new five.Board();
var robot = require('robotjs');

const period = 50;

function navigate(prev, cur) {
  console.log('navigate...')
  robot.typeString("navigate | ");
  // robot.keyTap('tab');
}

function enter(prev, cur) {
  console.log('  enter...')
  robot.typeString("  enter | ");
  // robot.keyTap('enter');
}

class BongoControl extends five.Sensor {
  constructor(sensorAddr, action) {
    super(sensorAddr);

    this.action = action;
    this.amplitude = 0;
    this.prev = null;
  }

}

// notes on analog
// you have to go into system preferences
// and go to security and privacy
// and explicitly let iterm control your computer
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
    this.amplitude += this.scaleTo(0, period);
  });

  bongo02.on('change', function() {
    this.amplitude += this.scaleTo(0, period);
  });

  function ineterval() {
    const bongo01Cur = bongo01.amplitude/period * 100;
    const bongo02Cur = bongo02.amplitude/period * 100;



    if( !bongo01.prev && bongo01Cur || !bongo02.prev && bongo02Cur ) {
      // bongo01Cur >= bongo02Cur ? bongo01.action() : bongo02.action();
      // if(bongo01Cur >= 6) { // navigate
      //   bongo01.action();
      // } else if(bongo02Cur >= 22) { //enter
      //   bongo02.action()
      // }
      if(bongo01Cur >= bongo02Cur) {
        if(bongo01Cur >= 6) { // navigate
          bongo01.action();
        }
      } else {
        if(bongo02Cur >= 22) { //enter
          bongo02.action()
        }
      }
      console.log('bongo01Cur ', bongo01Cur);
      console.log('bongo02Cur ', bongo02Cur);
      console.log('___');
    }

    bongo01.prev = bongo01Cur;
    bongo01.amplitude = 0;
    bongo02.prev = bongo02Cur;
    bongo02.amplitude = 0;
  }

  setInterval(ineterval, period);
});
