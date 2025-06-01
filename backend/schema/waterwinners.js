const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    // all schema will be different for different collection

    CONNECTION: String,
    NAME: String,
    WARD: Number,
    ZONE: Number,
    ADDRESS: String,
    SR_NO: Number,
    POSITION: {
      type: String,
      index: true // <<< INDEX ADDED HERE: Creates an index on the POSITION field.
                  // This will make queries filtering by POSITION (e.g., finding if a "1st" place winner already exists)
                  // significantly faster, especially as the number of winners grows.
                  // MongoDB will maintain this index to quickly locate documents based on their POSITION value.
    },
  },
  {
    collection: "WaterWinners",
  }
);

module.exports = mongoose.model("WaterWinners", winnerSchema);
