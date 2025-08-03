const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
require("./dbconnect2.js");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const ExcelJS = require("exceljs"); //excel
const JWT = require("jsonwebtoken");
const checkToken = require("./middlewares/isLoggedin.js");

// CORS configuration for both local and deployed environments
const allowedOrigins = [
  'http://localhost:3000',           // Local development
  'http://localhost:3001',           // Alternative local port
  'https://imc-lucky-draw.vercel.app',  // Main Vercel deployment
  'https://imc-lucky-draw-git-main-vinaylodhi1712s-projects.vercel.app', // Vercel git URL
  'https://imc-lucky-draw-vinaylodhi1712s-projects.vercel.app', // Alternative Vercel URL
  'https://imc-lucky-draw-main.vercel.app', // Possible main branch URL
  'https://imc-lucky-draw-preview.vercel.app' // Preview deployments
];

// Apply CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow any localhost origin
    if (origin && origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    
    // Allow any Vercel preview URL for this project
    if (origin && (origin.includes('imc-lucky-draw') && origin.includes('vercel.app'))) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

// Additional CORS headers middleware for better compatibility
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin) || 
      (origin && origin.startsWith('http://localhost')) ||
      (origin && origin.includes('imc-lucky-draw') && origin.includes('vercel.app'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Body parser middleware
app.use(express.json());

// schemas to get winners

const PropertyAdvance = mongoose.model(
  "PropertyAdvance",
  new mongoose.Schema({}, { strict: false }),
  "PropertyAdvance"
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

//get water 1st winner
app.get("/water_random-winner_1", async (req, resp) => {
  try {
    const existingWinner = await WaterWinners.findOne({ POSITION: "1st" });

    if (existingWinner) {
      return resp
        .status(400)
        .json({ message: "A 1st position winner already exists." });
    }
    let result = await WaterAdvance.aggregate([
      { $match: { isWinner: { $ne: true } } },
      { $sample: { size: 1 } },
    ]);

    if (result.length > 0) {
      const winner = result[0];

      // Mark as winner in PropertyAdvance
      await WaterAdvance.updateOne(
        { _id: winner._id },
        { $set: { isWinner: true } }
      );

      // Insert into Water Winners collection
      await WaterWinners.create({
        CONNECTION: winner.CONNECTION,
        NAME: winner.NAME,
        WARD: winner.WARD,
        ZONE: winner.ZONE,
        ADDRESS: winner.ADDRESS,
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

//get water 2nd winner
app.get("/water_random-winner_2", async (req, resp) => {
  try {
    const existingWinner = await WaterWinners.findOne({ POSITION: "2nd" });

    if (existingWinner) {
      return resp
        .status(400)
        .json({ message: "2nd position winners already exists." });
    }
    let result = await WaterAdvance.aggregate([
      { $match: { isWinner: { $ne: true } } },
      { $sample: { size: 3 } },
    ]);

    if (result.length > 0) {
      const winners = result.map((winner, index) => ({
        CONNECTION: winner.CONNECTION,
        NAME: winner.NAME,
        WARD: winner.WARD,
        ZONE: winner.ZONE,
        ADDRESS: winner.ADDRESS,
        POSITION: "2nd",
      }));

      // Mark winners as selected in PropertyAdvance
      const winnerIds = result.map((winner) => winner._id);
      await WaterAdvance.updateMany(
        { _id: { $in: winnerIds } },
        { $set: { isWinner: true } }
      );

      // Insert all winners into Winners collection
      await WaterWinners.insertMany(winners);

      resp.json(winners);
    } else {
      resp.status(404).json({ message: "No eligible winners found." });
    }
  } catch (error) {
    console.error("Error selecting winners:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

//get water 3rd winner
app.get("/water_random-winner_3", async (req, resp) => {
  try {
    const existingWinner = await WaterWinners.findOne({ POSITION: "3rd" });

    if (existingWinner) {
      return resp
        .status(400)
        .json({ message: "3rd position winner already exists." });
    }
    let result = await WaterAdvance.aggregate([
      { $match: { isWinner: { $ne: true } } },
      { $sample: { size: 5 } },
    ]);

    if (result.length > 0) {
      const winners = result.map((winner, index) => ({
        CONNECTION: winner.CONNECTION,
        NAME: winner.NAME,
        WARD: winner.WARD,
        ZONE: winner.ZONE,
        ADDRESS: winner.ADDRESS,
        POSITION: "3rd",
      }));

      // Mark winners as selected in PropertyAdvance
      const winnerIds = result.map((winner) => winner._id);
      await WaterAdvance.updateMany(
        { _id: { $in: winnerIds } },
        { $set: { isWinner: true } }
      );

      // Insert all winners into Winners collection
      await WaterWinners.insertMany(winners);

      resp.json(winners);
    } else {
      resp.status(404).json({ message: "No eligible winners found." });
    }
  } catch (error) {
    console.error("Error selecting winners:", error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});

//water zones

app.get("/water_random-zone-winners/:zoneNumber", async (req, resp) => {
  try {
    const { zoneNumber } = req.params;

    const existingWinner = await WaterWinners.findOne({
      POSITION: `Zone ${zoneNumber}`,
    });

    if (existingWinner) {
      return resp
        .status(400)
        .json({ message: `Zone ${zoneNumber} winners already exists.` });
    }

    let result = await WaterAdvance.aggregate([
      { $match: { ZONE: zoneNumber, isWinner: { $ne: true } } }, // Filter by zone and exclude previous winners
      { $sample: { size: 5 } },
    ]);

    if (result.length > 0) {
      const winnerIds = result.map((winner) => winner._id);

      // Mark selected winners in Zones collection
      await WaterAdvance.updateMany(
        { _id: { $in: winnerIds } },
        { $set: { isWinner: true } }
      );

      const winnersData = result.map((winner, index) => ({
        CONNECTION: winner.CONNECTION,
        NAME: winner.NAME,
        WARD: winner.WARD,
        ZONE: winner.ZONE,
        ADDRESS: winner.ADDRESS,
        POSITION: `Zone ${zoneNumber}`, // Assign positions
      }));

      // Insert winners into Winners collection
      await WaterWinners.insertMany(winnersData);

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
  try {
    if (req.body.Password && req.body.Email) {

      let user = await Author.findOne(req.body);
      let token;

      if (user) {
        token = JWT.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "7d",
        });
        return resp.status(200).send({
          success: true,
          message: "login successfull",
          token,
          user,
        });
      } else {
        return resp.status(400).send({
          success: false,
          message: "no such user found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "internal server error",
    });
  }
});

app.get("/userAuth", checkToken, async (req, resp) => {
  resp.status(200).send({
    success: true,
  });
});

app.listen(5000, () => {
  console.log("server running on port 5000");
});

// Get all property winners, sorted by position
app.get("/getAllPropertyWinners", async (req, resp) => {
  try {
    const propertyWinnerDocs = await Winners.find({}).lean(); // .lean() for plain JS objects

    // Custom sort logic for positions
    const customSort = (a, b) => {
      const posA = a.POSITION;
      const posB = b.POSITION;

      const getOrder = (pos) => {
        if (!pos) return 999; // Handle undefined or null positions
        if (pos === "1st") return 1;
        if (pos === "2nd") return 2;
        if (pos === "3rd") return 3;
        if (pos.startsWith("Zone ")) {
          const zoneNum = parseInt(pos.split(" ")[1], 10);
          return isNaN(zoneNum) ? 900 : 100 + zoneNum; // Zone 1 -> 101, Zone 2 -> 102
        }
        return 999; // Other/unknown
      };
      return getOrder(posA) - getOrder(posB);
    };

    propertyWinnerDocs.sort(customSort);

    resp.status(200).json(propertyWinnerDocs);
  } catch (error) {
    console.error("Error fetching property winners:", error);
    resp.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// Get all water winners, sorted by position
app.get("/getAllWaterWinners", async (req, resp) => {
  try {
    const waterWinnerDocs = await WaterWinners.find({}).lean();

    // Custom sort logic for positions (same as property)
    const customSort = (a, b) => {
      const posA = a.POSITION;
      const posB = b.POSITION;

      const getOrder = (pos) => {
        if (!pos) return 999;
        if (pos === "1st") return 1;
        if (pos === "2nd") return 2;
        if (pos === "3rd") return 3;
        if (pos.startsWith("Zone ")) {
          const zoneNum = parseInt(pos.split(" ")[1], 10);
          return isNaN(zoneNum) ? 900 : 100 + zoneNum;
        }
        return 999;
      };
      return getOrder(posA) - getOrder(posB);
    };
    
    waterWinnerDocs.sort(customSort);

    resp.status(200).json(waterWinnerDocs);
  } catch (error) {
    console.error("Error fetching water winners:", error);
    resp.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// Check if property winners exist for specific position
app.get("/checkPropertyWinners/:position", async (req, resp) => {
  try {
    const { position } = req.params;
    
    let positionName;
    if (position === "1") positionName = "1st";
    else if (position === "2") positionName = "2nd";
    else if (position === "3") positionName = "3rd";
    else {
      return resp.status(400).json({ hasWinners: false, error: "Invalid position" });
    }

    const existingWinner = await Winners.findOne({ POSITION: positionName });
    
    resp.json({ 
      hasWinners: !!existingWinner,
      position: positionName,
      message: existingWinner ? `${positionName} position winner already exists` : `${positionName} position available for draw`
    });
  } catch (error) {
    console.error("Error checking property winners:", error);
    resp.status(500).json({ hasWinners: false, error: "Internal Server Error" });
  }
});

// Check if water winners exist for specific position
app.get("/checkWaterWinners/:position", async (req, resp) => {
  try {
    const { position } = req.params;
    
    let positionName;
    if (position === "1") positionName = "1st";
    else if (position === "2") positionName = "2nd";
    else if (position === "3") positionName = "3rd";
    else {
      return resp.status(400).json({ hasWinners: false, error: "Invalid position" });
    }

    const existingWinner = await WaterWinners.findOne({ POSITION: positionName });
    
    resp.json({ 
      hasWinners: !!existingWinner,
      position: positionName,
      message: existingWinner ? `${positionName} position winner already exists` : `${positionName} position available for draw`
    });
  } catch (error) {
    console.error("Error checking water winners:", error);
    resp.status(500).json({ hasWinners: false, error: "Internal Server Error" });
  }
});

// Check if property zone winners exist for specific zone
app.get("/checkPropertyZoneWinners/:zoneNumber", async (req, resp) => {
  try {
    const { zoneNumber } = req.params;
    
    const existingWinner = await Winners.findOne({ POSITION: `Zone ${zoneNumber}` });
    
    resp.json({ 
      hasWinners: !!existingWinner,
      zone: zoneNumber,
      message: existingWinner ? `Zone ${zoneNumber} winners already exist` : `Zone ${zoneNumber} available for draw`
    });
  } catch (error) {
    console.error("Error checking property zone winners:", error);
    resp.status(500).json({ hasWinners: false, error: "Internal Server Error" });
  }
});

// Check if water zone winners exist for specific zone
app.get("/checkWaterZoneWinners/:zoneNumber", async (req, resp) => {
  try {
    const { zoneNumber } = req.params;
    
    const existingWinner = await WaterWinners.findOne({ POSITION: `Zone ${zoneNumber}` });
    
    resp.json({ 
      hasWinners: !!existingWinner,
      zone: zoneNumber,
      message: existingWinner ? `Zone ${zoneNumber} winners already exist` : `Zone ${zoneNumber} available for draw`
    });
  } catch (error) {
    console.error("Error checking water zone winners:", error);
    resp.status(500).json({ hasWinners: false, error: "Internal Server Error" });
  }
});