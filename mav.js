const SerialPort = require("serialport");
const mavlink = require("mavlink");

var myMAV = new mavlink(1, 1, "v1.0", ["common", "ardupilotmega"]);

var port = new SerialPort("/dev/ttyACM0", {
  autoOpen: false,
  baudRate: 57600,
});

port.open(function (err) {
  if (err) {
    return console.log("Error opening port: ", err.message);
  }
});

myMAV.on("ready", function () {
  //parse incoming serial data
  port.on("data", function (data) {
    myMAV.parse(data);
  });

  //listen for messages
  myMAV.on("PARAM_VALUE", function (message, fields) {
    console.log(fields);
  });

  myMAV.createMessage(
    "PARAM_REQUEST_LIST",
    {
      target_system: 1,
      target_component: 1,
    },
    function (message) {
      port.write(message.buffer);
      console.log(message)

      setTimeout(function () {
        myMAV.on("PARAM_VALUE", function (message, fields) {
          console.log(fields);
        })
        console.log("mantap")
      }, 10000);
    }
  );



  

  // myMAV.createMessage(
  //   "MISSION_COUNT",
  //   {
  //     target_system: 0,
  //     target_component: 0,
  //     count: 5,
  //     mission_type: 0,
  //   },
  //   function (message) {
  //     port.write(message.buffer);
      
  //   }
  // );

  // setTimeout(function () {
  //   const myMav = myMAV;
  //   port.on("data", function (data) {
  //     console.log();
  //   });
  // }, 1000);
});
