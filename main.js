const five = require('johnny-five');
const board = new five.Board();
let led;
let toggleState = false;

board.on("ready", function() {
  console.log("Board ready");

  led = new five.Led(13);

  setInterval(toggleLED, 200);

  function toggleLED() {
    toggleState = !toggleState;

    if(toggleState) led.on();
    else led.off();
  }
});

console.log("waiting for our device to connect");
