// const SerialPort = require("serialport");
const dgram = require("dgram");
const mavlink = require("mavlink");
const myMAV = new mavlink(1, 1, "v1.0", ["common", "ardupilotmega"]);

//INTERNAL SERVER
// const server = dgram.createSocket("udp4");

// server.on("error", (err) => {
//   console.log(`server error:\n${err.stack}`);
//   server.close();
// });

// server.on("message", (msg, rinfo) => {
//   console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
// });

// server.on("listening", () => {
//   const address = server.address();
//   console.log(`server listening ${address.address}:${address.port}`);
// });

// server.bind({
//   address: "localhost",
//   port: 8000,
// });

//CONNECTED UAV
const client = dgram.createSocket("udp4");
const uavAddress = "11.11.11.211";
const uavPort = 14553;
const UAV = client.connect(uavPort, uavAddress, () => {
  console.log("success connecting to UAV!");
});
// client.send("Hello", 0, 7, uavAddress, "localhost");

//MAVLINK
// const port = new SerialPort("/dev/ttyACM0", {
//   autoOpen: true,
//   baudRate: 115200,
// });

myMAV.on("ready", function () {
  //REQUEST_PARAM_LIST
  setInterval(function () {
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
        client.send(message.buffer, () => {
          console.log("request param");
        });

      }
    );

  }, 3000);

  client.on("message", function (msg) {
    myMAV.parse(msg);
  });

  myMAV.on("HEARTBEAT", function (message, field) {
    console.log(field);
  });

  // myMAV.createMessage("HEARTBEAT", {}, function (message) {
  //   client.send(message.buffer, () => {
  //     console.log("request heart beat");
  //   });
  // });

  //parse incoming serial data

  //listen for messages
  //   myMAV.on("message", function (message) {
  //     console.log(message);
  //   });

  // listen for attitude
  // myMAV.on("ATTITUDE", function (message, field) {
  //   console.log(field);
  // });

  //listen for heartbeat
  // myMAV.on("HEARTBEAT", function (message, field) {
  //   console.log(field);
  // });

  //setting parameter
  // myMAV.on("SYS_STATUS", function (message, field) {
  //   console.log(field);
  // });
});
