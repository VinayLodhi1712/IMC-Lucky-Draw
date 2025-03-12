const express = require("express");
require("./dbconnect2.js");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const PropertyAdvance = mongoose.model(
  "PropertyAdvance",
  new mongoose.Schema({}, { strict: false }),
  "PropertyAdvance"
);

const Zones = mongoose.model(
  "Pzones",
  new mongoose.Schema({}, { strict: false }),
  "Pzones"
);
const WaterAdvance = mongoose.model(
  "WaterAdvance",
  new mongoose.Schema({}, { strict: false }),
  "WaterAdvance"
);
const Author = mongoose.model(
  "Author",
  new mongoose.Schema({}, { strict: false }),
  "Author"
);
const ExcelJS = require("exceljs"); //excel

// add winners to database
const Winners = require("./schema/propertywinners.js"); //post winners
const WaterWinners = require("./schema/waterwinners.js"); //post water

//get property 1 2 3 winners
app.get("/search1/:key", async (req, resp) => {
  const key = Number(req.params.key);
  try {
    let result = await PropertyAdvance.find({ SR_NO: key });
    resp.send(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    resp.status(500).send("Internal Server Error");
  }
});

//get property zone winners
app.get("/search2/:key", async (req, resp) => {
  const key = req.params.key;
  let result = await Zones.find({ SR_NO: key });
  resp.send(result);
});

//get water
app.get("/search3/:key", async (req, resp) => {
  const key = req.params.key;
  let result = await WaterAdvance.find({ SR_NO: key });
  resp.send(result);
});

//first post
app.post("/first/:srno", async (req, resp) => {
  const srno = req.params.srno;
  let result = await Winners.insertMany(req.body);
  await Winners.updateOne(
    { SR_NO: srno },
    { $set: { POSITION: "1st winner" } }
  );
  resp.send(result);
});

//second post
app.post("/second/:srno", async (req, resp) => {
  const srno = req.params.srno;
  let result = await Winners.insertMany(req.body);
  await Winners.updateMany(
    { SR_NO: srno },
    { $set: { POSITION: "2nd winner" } }
  );
  resp.send(result);
});

//third post
app.post("/third/:srno", async (req, resp) => {
  const srno = req.params.srno;
  let result = await Winners.insertMany(req.body);
  await Winners.updateMany(
    { SR_NO: srno },
    { $set: { POSITION: "3rd winner" } }
  );
  resp.send(result);
});

//property zones post
app.post("/Forth/Zone/:zoneNumber/:srno", async (req, resp) => {
  try {
    const { zoneNumber, srno } = req.params;
    const result = await Winners.insertMany(req.body);

    await Winners.updateMany(
      { SR_NO: srno },
      { $set: { POSITION: `Zone ${zoneNumber} winner` } }
    );

    resp
      .status(201)
      .json({ message: `Winners added for Zone ${zoneNumber}`, result });
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/GenerateExcel", async (req, resp) => {
  try {
    const data = await Winners.find({});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Winners Data");

    // Define column headers dynamically
    worksheet.columns = [
      { header: "PARTNER", key: "PARTNER", width: 20 },
      { header: "PROPERTY_OWNER_NAME", key: "PROPERTY_OWNER_NAME", width: 25 },
      { header: "WARD", key: "WARD", width: 10 },
      { header: "ZONE", key: "ZONE", width: 10 },
      { header: "ASSESSMENT_YEAR", key: "ASSMENTYEAR", width: 15 },
      { header: "POSITION", key: "POSITION", width: 20 },
    ];

    // Add data rows
    data.forEach((item) => {
      worksheet.addRow({
        PARTNER: item.PARTNER,
        PROPERTY_OWNER_NAME: item.PROPERTY_OWNER_NAME,
        WARD: item.WARD,
        ZONE: item.ZONE,
        ASSESSMENT_YEAR: item.ASSMENTYEAR,
        POSITION: item.POSITION,
      });
    });

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers for file download
    resp.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    resp.setHeader(
      "Content-Disposition",
      "attachment; filename=winners-data.xlsx"
    );

    resp.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

//water post
app.post("/waterfirst/:srno", async (req, resp) => {
  const srno = req.params.srno;
  let result = await WaterWinners.insertMany(req.body);
  await WaterWinners.updateMany(
    { SR_NO: srno },
    { $set: { POSITION: "1st winner" } }
  );
  resp.send(result);
});

app.post("/watersecond/:srno", async (req, resp) => {
  const srno = req.params.srno;
  let result = await WaterWinners.insertMany(req.body);
  await WaterWinners.updateMany(
    { SR_NO: srno },
    { $set: { POSITION: "2nd winner" } }
  );
  resp.send(result);
});

app.post("/waterthird/:srno", async (req, resp) => {
  const srno = req.params.srno;
  let result = await WaterWinners.insertMany(req.body);
  await WaterWinners.updateMany(
    { SR_NO: srno },
    { $set: { POSITION: "3rd winner" } }
  );
  resp.send(result);
});

//water zones

const handleZoneWinner = async (req, resp, zone) => {
  const srno = req.params.srno;
  let result = await WaterWinners.insertMany(req.body);
  await WaterWinners.updateMany(
    { SR_NO: srno },
    { $set: { POSITION: `${zone} winner` } }
  );
  resp.send(result);
};

// Define routes for each zone using a loop
for (let zone = 1; zone <= 19; zone++) {
  app.post(`/WaterForth/Zone${zone}/:srno`, async (req, resp) => {
    await handleZoneWinner(req, resp, `Zone ${zone}`);
  });
}

//water excel

app.get("/GenerateExcelWater", async (req, resp) => {
  try {
    const data = await WaterWinners.find({});

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Define column headers
    worksheet.columns = [
      { header: "CONNECTION NUMBER", key: "CONNECTION", width: 15 },
      { header: "NAME", key: "NAME", width: 15 },
      { header: "WARD", key: "WARD", width: 15 },
      { header: "ZONE", key: "ZONE", width: 15 },
      { header: "ADDRESS", key: "ADDRESS", width: 15 },
      { header: "POSITION", key: "POSITION", width: 15 },
    ];
    // Populate the worksheet with data
    data.forEach((item) => {
      worksheet.addRow({
        CONNECTION: item.CONNECTION,
        NAME: item.NAME,
        WARD: item.WARD,
        ZONE: item.ZONE,
        ADDRESS: item.ADDRESS,
        POSITION: item.POSITION,
        // Map MongoDB fields to Excel columns
      });
    });

    // Save the Excel file to disk
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers for downloading
    resp.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    resp.setHeader(
      "Content-Disposition",
      "attachment; filename=mongodb-data.XLSX"
    );

    // Send the XLSX file as a response
    resp.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).send("Internal Server Error");
  }
});

// api to login

app.post("/Login", async (req, resp) => {
  if (req.body.Password && req.body.Email) {
    //user must enter both emil and password for login
    let result = await Author.findOne(req.body); //.select("-Password"); //select everthing except password
    if (result) {
      resp.send(result);
    } else {
      resp.send("0");
    }
  } else {
    resp.send("1");
  }
});

app.listen(5000, () => {
  console.log("server running on port 5000");
});
