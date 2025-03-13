const express = require("express");
require("./dbconnect2.js");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const ExcelJS = require("exceljs"); //excel

app.use(cors());
app.use(express.json());

// schemas to get winners

const PropertyAdvance = mongoose.model(
  "PropertyAdvance",
  new mongoose.Schema({}, { strict: false }),
  "PropertyAdvance"
);

// zone winners
const Zones = mongoose.model(
  "Pzones",
  new mongoose.Schema({}, { strict: false }),
  "Pzones"
);

// water winners
const WaterAdvance = mongoose.model(
  "WaterAdvance",
  new mongoose.Schema({}, { strict: false }),
  "WaterAdvance"
);

// login
const Author = mongoose.model(
  "Author",
  new mongoose.Schema({}, { strict: false }),
  "Author"
);

// add winners to database
const Winners = require("./schema/propertywinners.js"); //post winners
const WaterWinners = require("./schema/waterwinners.js"); //post water

// property first winner
app.get("/property_random-winner_1", async (req, resp) => {
  try {
    const existingWinner = await Winners.findOne({ POSITION: "1st" });

    if (existingWinner) {
      return resp
        .status(400)
        .json({ message: "A 1st position winner already exists." });
    }
    let result = await PropertyAdvance.aggregate([
      { $match: { isWinner: { $ne: true } } },
      { $sample: { size: 1 } },
    ]);

    if (result.length > 0) {
      const winner = result[0];

      // Mark as winner in PropertyAdvance
      await PropertyAdvance.updateOne(
        { _id: winner._id },
        { $set: { isWinner: true } }
      );

      // Insert into Winners collection
      await Winners.create({
        PARTNER: winner.PARTNER,
        PROPERTY_OWNER_NAME: winner.PROPERTY_OWNER_NAME,
        WARD: winner.WARD,
        ZONE: winner.ZONE,
        ASSMENTYEAR: winner.ASSMENTYEAR,
        TAX_AMT: winner.TAX_AMT,
        SR_NO: winner.SR_NO,
        POSITION: "1st",
      });

      resp.json(winner);
    } else {
      resp.status(404).json({ message: "No eligible winners found." });
    }
  } catch (error) {
    console.error("Error selecting winner:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

//get property 2 winner
app.get("/property_random-winner_2", async (req, resp) => {
  try {
    const existingWinner = await Winners.findOne({ POSITION: "2nd" });

    if (existingWinner) {
      return resp
        .status(400)
        .json({ message: "2nd position winners already exists." });
    }
    let result = await PropertyAdvance.aggregate([
      { $match: { isWinner: { $ne: true } } },
      { $sample: { size: 3 } },
    ]);

    if (result.length > 0) {
      const winners = result.map((winner, index) => ({
        PARTNER: winner.PARTNER,
        PROPERTY_OWNER_NAME: winner.PROPERTY_OWNER_NAME,
        WARD: winner.WARD,
        ZONE: winner.ZONE,
        ASSMENTYEAR: winner.ASSMENTYEAR,
        TAX_AMT: winner.TAX_AMT,
        SR_NO: winner.SR_NO,
        POSITION: "2nd",
      }));

      // Mark winners as selected in PropertyAdvance
      const winnerIds = result.map((winner) => winner._id);
      await PropertyAdvance.updateMany(
        { _id: { $in: winnerIds } },
        { $set: { isWinner: true } }
      );

      // Insert all winners into Winners collection
      await Winners.insertMany(winners);

      resp.json(winners);
    } else {
      resp.status(404).json({ message: "No eligible winners found." });
    }
  } catch (error) {
    console.error("Error selecting winners:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

//get property 3 winner
app.get("/property_random-winner_3", async (req, resp) => {
  try {
    const existingWinner = await Winners.findOne({ POSITION: "3rd" });

    if (existingWinner) {
      return resp
        .status(400)
        .json({ message: "3rd position winner already exists." });
    }
    let result = await PropertyAdvance.aggregate([
      { $match: { isWinner: { $ne: true } } },
      { $sample: { size: 5 } },
    ]);

    if (result.length > 0) {
      const winners = result.map((winner, index) => ({
        PARTNER: winner.PARTNER,
        PROPERTY_OWNER_NAME: winner.PROPERTY_OWNER_NAME,
        WARD: winner.WARD,
        ZONE: winner.ZONE,
        ASSMENTYEAR: winner.ASSMENTYEAR,
        TAX_AMT: winner.TAX_AMT,
        SR_NO: winner.SR_NO,
        POSITION: "3rd",
      }));

      // Mark winners as selected in PropertyAdvance
      const winnerIds = result.map((winner) => winner._id);
      await PropertyAdvance.updateMany(
        { _id: { $in: winnerIds } },
        { $set: { isWinner: true } }
      );

      // Insert all winners into Winners collection
      await Winners.insertMany(winners);

      resp.json(winners);
    } else {
      resp.status(404).json({ message: "No eligible winners found." });
    }
  } catch (error) {
    console.error("Error selecting winners:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

// property zone winners
app.get("/property_random-zone-winners/:zoneNumber", async (req, resp) => {
  try {
    const { zoneNumber } = req.params;

    const existingWinner = await Winners.findOne({
      POSITION: `Zone ${zoneNumber}`,
    });

    if (existingWinner) {
      return resp
        .status(400)
        .json({ message: `Zone ${zoneNumber} winners already exists.` });
    }

    let result = await PropertyAdvance.aggregate([
      { $match: { ZONE: zoneNumber, isWinner: { $ne: true } } }, // Filter by zone and exclude previous winners
      { $sample: { size: 5 } },
    ]);

    if (result.length > 0) {
      const winnerIds = result.map((winner) => winner._id);

      // Mark selected winners in Zones collection
      await PropertyAdvance.updateMany(
        { _id: { $in: winnerIds } },
        { $set: { isWinner: true } }
      );

      const winnersData = result.map((winner, index) => ({
        PARTNER: winner.PARTNER,
        PROPERTY_OWNER_NAME: winner.PROPERTY_OWNER_NAME,
        WARD: winner.WARD,
        ZONE: winner.ZONE,
        ASSMENTYEAR: winner.ASSMENTYEAR,
        TAX_AMT: winner.TAX_AMT,
        SR_NO: winner.SR_NO,
        POSITION: `Zone ${zoneNumber}`, // Assign positions
      }));

      // Insert winners into Winners collection
      await Winners.insertMany(winnersData);

      resp.status(201).json({
        message: `5 winners added for Zone ${zoneNumber}`,
        winners: winnersData,
      });
    } else {
      resp
        .status(404)
        .json({ message: `Not enough eligible winners in Zone ${zoneNumber}` });
    }
  } catch (error) {
    console.error("Error selecting zone winners:", error);
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

// water winners

//get water
app.get("/search3/:key", async (req, resp) => {
  const key = req.params.key;
  let result = await WaterAdvance.find({ SR_NO: key });
  resp.send(result);
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
