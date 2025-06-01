const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    PARTNER: String,
    PROPERTY_OWNER_NAME: String,
    WARD: Number,
    ZONE: Number,
    ASSMENTYEAR: String,
    TAX_AMT: String,
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
    collection: "Winners",
    timestamps: true,
  }
);

module.exports = mongoose.model("Winners", winnerSchema);
