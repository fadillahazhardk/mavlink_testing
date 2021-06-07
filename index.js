const SerialPort = require("serialport");

//DETECTING PORT THAT CONNECT TO FC
let portMetadata;
let portPath;

//Mencari port yang terhubung dengan FC, yaitu port dengan nilai manufacture = 3D Robotics
const findPortWithFC = async () => {
  try {
    let selectedPort;

    const ports = await SerialPort.list(); //Mengembalikan promise

    ports.forEach((portCandidate) => {
      if (portCandidate.manufacturer === "3D Robotics") {
        selectedPort = portCandidate;
      }
    });

    if (selectedPort) {
      return selectedPort;
    } else {
      //Mengembalikan pesan jika port dengan FC tidak ditemukan
      return {
        message: "Not Found!",
        note: "Port yang terhubung dengan FC tidak ditemukan!",
      };
    }
  } catch (err) {
    console.log("Error:" + err);
  }
};

(async () => {
  //PAKEIN TRY CATCH ENTAR

  portMetadata = await findPortWithFC();
  portPath = portMetadata.path;

  //CONNECTING TO SERIALPORT THAT CONNECT TO FC
  const port = new SerialPort(portPath, {
    autoOpen: false,
    baudRate: 115200,
  });

  //Membuka Port
  port.open(() => {
    console.log(`Port yang terhubung dengan FC : "${portPath}" Terbuka!`);
  });
})();
