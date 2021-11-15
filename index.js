const SerialPort = require("serialport");
// const findPort = require("./findPort");
const mavlink = require("mavlink");
const myMAV = new mavlink(1, 1, "v1.0", ["common", "ardupilotmega"]);

// setTimeout(() => {
//   //Parsing Port With FC Metadata
//   const portMetadata = findPort.port;
//   console.log(portMetadata)
//   //CONNECTING TO SERIALPORT THAT CONNECT TO FC
//   const port = new SerialPort(portMetadata.path, {
//     autoOpen: false,
//     baudRate: 115200,
//   });

//   // Membuka Port
//   port.open(() => {
//     console.log(
//       `Port yang terhubung dengan FC : "${portMetadata.path}" Terbuka!`
//     );
//   });
// }, 3000);

//CONNECTING TO SERIALPORT THAT CONNECT TO FC
const port = new SerialPort("/dev/ttyACM0", {
  autoOpen: false,
  baudRate: 115200,
});

port.open(() => {
  console.log(`Port yang terhubung dengan FC : ${port.path} Terbuka!`);
});

myMAV.on("ready", function () {
  myMAV.createMessage(
    "HEARTBEAT",
    {
      type: 6,
      autopilot: 12,
      base_mode: 1,
      custom_mode: 1,
      system_status: 1,
      mavlink_version: 3,
    },
    function (message) {
      port.write(message.buffer, () => {
        console.log("request param");
      });
    }
  );
  
  //parse incoming serial data
  port.on("data", function (data) {
    myMAV.parse(data);
  });

  //listen for messages
  myMAV.on("HEARTBEAT", function (message) {
    console.log(message);
  });

  port.on("message", () => {
    myMAV.on("HEARTBEAT", function (message, fields) {
      console.log(fields);
    });
  });

  // myMAV.createMessage(
  //   "PARAM_REQUEST_LIST",
  //   {
  //     //Membuat messagenya terlebih dahulu
  //     target_system: 1,
  //     target_component: 1,
  //   },
  //   function (message) {
  //     console.log("Requesting all parameters to PX4...");
  //     //Gunakan mavlink v1 (karena meliputi array of char)
  //     use_v1 = true;
  //     setTimeout(() => {
  //       //Mengirim PARAM_REQUEST_LIST ke PX4
  //       port.write(message.buffer);
  //     }, 1000);
  //     setTimeout(() => {
  //       //Timeout untuk mematikan parser mavlink v1
  //       use_v1 = false;
  //     }, 2000);
  //   }
  // );
});
